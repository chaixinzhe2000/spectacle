import { ITestAnchorDatabaseConnection } from "../IAnchorDatabaseConnection";
import { IServiceResponse, successfulServiceResponse, failureServiceResponse, getServiceResponse, IAnchor } from "spectacle-interfaces"
import { getMongoAnchor, IMongoAnchor, tryGetAnchor } from "../helpers";

// TODO: completed by Chai
class MockMongoDatabaseConnection implements ITestAnchorDatabaseConnection {

	_anchors: { [anchorId: string]: IMongoAnchor }

	constructor() {
		this._anchors = {}
		this.clearAnchorCollection = this.clearAnchorCollection.bind(this);
		this.initAnchors = this.initAnchors.bind(this);
		this.insertAnchor = this.insertAnchor.bind(this);
		this.findAnchor = this.findAnchor.bind(this);
		this.findAnchors = this.findAnchors.bind(this);
		this.findAnchorsByNode = this.findAnchorsByNode.bind(this);
		this.deleteAnchor = this.deleteAnchor.bind(this);
		this.deleteAnchors = this.deleteAnchors.bind(this);
		this.deleteAnchorsByNode = this.deleteAnchorsByNode.bind(this);
		this.updateAnchorCreatedTime = this.updateAnchorCreatedTime.bind(this);
		this.updateAnchorContent = this.updateAnchorContent.bind(this);
	}

	async updateAnchorCreatedTime(anchorId: string): Promise<IServiceResponse<IAnchor>> {
		const mongoAnchor = this._anchors[anchorId]
		if (mongoAnchor) {
			const tryCreateAnchorResp = tryGetAnchor(mongoAnchor)
			if (tryCreateAnchorResp.success = true) {
				let anchor = tryCreateAnchorResp.payload
				anchor.createdAt = new Date()
				return successfulServiceResponse(anchor)
			}
			return failureServiceResponse("Failed to convert to IAnchor")
		}
		return failureServiceResponse("Failed to find anchor");
	}

	async clearAnchorCollection(): Promise<IServiceResponse<{}>> {
		this._anchors = {}
		return successfulServiceResponse({})
	}

    async updateLastAnnotation(anchorId: string, content: string, author: string): Promise<IServiceResponse<IAnchor>> {
        if (author == null || author === ""){
            author = "Anonymous"
        }
        // content can be null because if content is null we assume deletion of last annotation
        if (typeof anchorId !== "string" || (typeof content !== "string" && content != null) || (typeof author !== "string" && author != null)){
            return failureServiceResponse("updateLastAnnotation argument has wrong type")
        }
        const anchor = this._anchors[anchorId];
        const tryCreateAnchorResp = tryGetAnchor(anchor)
        if (tryCreateAnchorResp.success === true) {
            let anchor: IAnchor = tryCreateAnchorResp.payload
            anchor.contentList.pop()
            anchor.authorList.pop()
            if (content !== "" && content !== null){
                anchor.contentList.push(content)
                anchor.authorList.push(author)
            }
            // convert to mongoAnchor and push it back
            const mongoAnchorResp = getMongoAnchor(anchor)
            if (!mongoAnchorResp.success) {
                return failureServiceResponse(mongoAnchorResp.message)
            }
            const mongoAnchor = mongoAnchorResp.payload
            try {
                // first delete, then add it back to the collection
                await collection.deleteOne({ _id: anchorId })
                const insertResponse = await collection.insertOne(mongoAnchor)
                // check that authorlist and content list are same length
                if (insertResponse.result.ok && (anchor.authorList.length === anchor.contentList.length)) {
                    return successfulServiceResponse(anchor)
                } else {
                    return failureServiceResponse("Failed due to disagreement in authorList and contentList length")
                }
            } catch (e) {
                return failureServiceResponse(`Failed to create new anchor, it's possible that a anchor with anchorId: ${anchor.anchorId} already exists.`)
            }
			}
			return failureServiceResponse("Found anchor, but failed to create IAnchor object")
		}
		return failureServiceResponse("Failed to find anchors")
	}

	async initAnchors(anchors: IAnchor[]): Promise<IServiceResponse<{}>> {
		anchors.forEach(anchor => {
			const mongoAnchorResp = getMongoAnchor(anchor)
			if (!mongoAnchorResp.success) {
				return failureServiceResponse(mongoAnchorResp.message)
			}
			this._anchors[anchor.anchorId] = mongoAnchorResp.payload
		})
		return successfulServiceResponse({})
	}

	async insertAnchor(anchor: IAnchor): Promise<IServiceResponse<IAnchor>> {
		const mongoAnchorResp = getMongoAnchor(anchor)
		if (!mongoAnchorResp.success) {
			return failureServiceResponse(mongoAnchorResp.message)
		} if (this._anchors[anchor.anchorId])
			return failureServiceResponse("Anchor already exists")
		this._anchors[anchor.anchorId] = mongoAnchorResp.payload
		return successfulServiceResponse(anchor)
	}

	async findAnchor(anchorId: string): Promise<IServiceResponse<IAnchor>> {
		const anchor = this._anchors[anchorId]
		if (anchor) {
			const tryCreateAnchorResp = tryGetAnchor(anchor)
			return getServiceResponse(tryCreateAnchorResp, "Failed to find anchor\n")
		}
		return failureServiceResponse("Failed to find anchors")
	}

	async findAnchors(anchorIds: string[]): Promise<IServiceResponse<{ [anchorId: string]: IAnchor }>> {
		if (anchorIds === null)
			return failureServiceResponse("input is null")
		const anchors: { [anchorId: string]: IAnchor } = {}

		async function findAndAdd(anchorId: string, findAnchor: Function) {
			const findResponse = await findAnchor(anchorId)
			if (findResponse.success)
				anchors[findResponse.payload.anchorId] = findResponse.payload
		}

		await Promise.all(anchorIds.map(anchorId => {
			return findAndAdd(anchorId, this.findAnchor)
		}));

		if (Object.keys(anchors).length === 0) {
			return failureServiceResponse("Failed to find any anchors.")
		}

		return successfulServiceResponse(anchors)
	}

	async findAnchorsByNode(nodeId: string): Promise<IServiceResponse<{ [anchorId: string]: IAnchor }>> {
		if (nodeId === null)
			return failureServiceResponse("input is null")
		const anchors: { [anchorId: string]: IAnchor } = {}

		Object.values(this._anchors).forEach(anc => {
			if (anc.nodeId === nodeId) {
				const anchorResp = tryGetAnchor(anc)
				if (anchorResp.success) {
					anchors[anchorResp.payload.anchorId] = anchorResp.payload
				}
			}
		});

		if (Object.keys(anchors).length > 0)
			return successfulServiceResponse(anchors)
		else
			return failureServiceResponse("Couldn't find any anchors with nodeId: " + nodeId)
	}

	async deleteAnchor(anchorId: string): Promise<IServiceResponse<{}>> {
		if (anchorId === null)
			return failureServiceResponse("input is null")
		delete this._anchors[anchorId]
		return successfulServiceResponse({})
	}

	async deleteAnchors(anchorIds: string[]): Promise<IServiceResponse<{}>> {
		if (anchorIds === null)
			return failureServiceResponse("input is null")
		let count = 0

		anchorIds.forEach(aid => {
			if (this._anchors[aid]) {
				delete this._anchors[aid]
				count++
			}
		})

		return successfulServiceResponse(count)
	}

	async deleteAnchorsByNode(nodeId: string): Promise<IServiceResponse<{}>> {
		if (nodeId === null)
			return failureServiceResponse("input is null")
		let count = 0
		const anchorsToDelete: IAnchor[] = []

		Object.values(this._anchors).forEach(anc => {
			if (anc.nodeId === nodeId) {
				const anchorResp = tryGetAnchor(anc)
				if (anchorResp.success) {
					anchorsToDelete.push(anchorResp.payload)
				}
			}
		});

		anchorsToDelete.forEach(anch => {
			if (this._anchors[anch.anchorId]) {
				delete this._anchors[anch.anchorId]
				count++
			}
		})

		return successfulServiceResponse({})

    }
    
    async addNewAnnotation(anchorId: string, content: string, author: string): Promise<IServiceResponse<IAnchor>> {
        if (anchorId == null || anchorId === ""){
            return failureServiceResponse("anchorId is null or empty")
        }
        if (author == null || author === ""){
            return failureServiceResponse("author is null or empty")
        }
        if (content == null || content === ""){
            return failureServiceResponse("content is null or empty")
        }
        if (typeof anchorId !== "string" || typeof content !== "string" || typeof author !== "string"){
            return failureServiceResponse("addNewAnnotation argument has wrong type")
        }
        const collection = await getCollection(MongoDbConnection);
		const findResponse = await collection.findOne({ _id: anchorId })
		if (findResponse && findResponse._id === anchorId) {
			const tryCreateAnchorResp = tryGetAnchor(findResponse)
			if (tryCreateAnchorResp.success === true) {
				let anchor: IAnchor = tryCreateAnchorResp.payload
                anchor.contentList.push(content)
                anchor.authorList.push(author)
				// convert to mongoAnchor and push it back
				const mongoAnchorResp = getMongoAnchor(anchor)
				if (!mongoAnchorResp.success) {
					return failureServiceResponse(mongoAnchorResp.message)
				}
				const mongoAnchor = mongoAnchorResp.payload
				try {
					// first delete, then add it back to the collection
					await collection.deleteOne({ _id: anchorId })
                    const insertResponse = await collection.insertOne(mongoAnchor)
                    // check that authorlist and content list are same length
					if (insertResponse.result.ok && (anchor.authorList.length === anchor.contentList.length)) {
						return successfulServiceResponse(anchor)
                    } else {
                        return failureServiceResponse("Failed due to disagreement in authorList and contentList length")
                    }
				} catch (e) {
					return failureServiceResponse(`Failed to create new anchor, it's possible that a anchor with anchorId: ${anchor.anchorId} already exists.`)
				}
			}
			return failureServiceResponse("Found anchor, but failed to create IAnchor object")
		}
		return failureServiceResponse("Failed to find anchors")
    }
}

export default MockMongoDatabaseConnection