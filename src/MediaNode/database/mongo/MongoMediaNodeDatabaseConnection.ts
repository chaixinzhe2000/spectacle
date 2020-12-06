import { ITestMediaNodeDatabaseConnection } from "../MediaNodeDatabaseConnection";
import MongoDbConnection from "../../../mongodbConnection";
import {
	IServiceResponse,
	successfulServiceResponse,
	failureServiceResponse,
	IMediaNode,
	getServiceResponse,
} from "spectacle-interfaces";
import { getMongoNode, IMongoIMediaNode, tryGetNode } from "../helpers";
import { getNodeCollection } from "./getCollection";

// TODO: completed by Chai

function isValidHttpUrl(urlString: string) {
	let url;
	try {
		url = new URL(urlString);
	} catch (_) {
		return false;
	}
	return url.protocol === "http:" || url.protocol === "https:";
}

const MongoDatabaseConnection: ITestMediaNodeDatabaseConnection = {
	async clearNodeCollection(): Promise<IServiceResponse<{}>> {
		const collection = await getNodeCollection(MongoDbConnection);
		const response = await collection.deleteMany({});
		if (response.result.ok) {
			return successfulServiceResponse({});
		}
		return failureServiceResponse("Failed to clear node collection.");
	},

	async initNodes(nodes: IMediaNode[]): Promise<IServiceResponse<{}>> {
		const mongoNodes: IMongoIMediaNode[] = []

		nodes.forEach(node => {
			const mongoNodeResp = getMongoNode(node)
			if (!mongoNodeResp.success) {
				return failureServiceResponse(mongoNodeResp.message)
			}
			mongoNodes.push(mongoNodeResp.payload)
		})

		try {
			const collection = await getNodeCollection(MongoDbConnection);
			const insertResponse = await collection.insertMany(mongoNodes)
			if (insertResponse.result.ok) {
				return successfulServiceResponse({})
			}
		} catch (e) {
			return failureServiceResponse(`Failed to create new nodes.`)
		}
	},

	async insertNode(node: IMediaNode): Promise<IServiceResponse<IMediaNode>> {

		const mongoNodeResp = getMongoNode(node)
		if (!mongoNodeResp.success) {
			return failureServiceResponse(mongoNodeResp.message)
		}
		const mongoNode = mongoNodeResp.payload

		try {
			const collection = await getNodeCollection(MongoDbConnection);
			const insertResponse = await collection.insertOne(mongoNode)
			if (insertResponse.result.ok) {
				return successfulServiceResponse(node)
			}
		} catch (e) {
			return failureServiceResponse(`Failed to create new node, it's possible that a node with nodeId: ${node.nodeId} already exists.`)
		}

	},

	async findNode(nodeId: string): Promise<IServiceResponse<IMediaNode>> {

		const collection = await getNodeCollection(MongoDbConnection);
		const findResponse = await collection.findOne({ _id: nodeId })

		if (findResponse && findResponse._id === nodeId) {
			const tryCreateNodeResp = tryGetNode(findResponse)
			return getServiceResponse(tryCreateNodeResp, "Failed to find node\n")
		}
		return failureServiceResponse("Failed to find nodes")
	},

	async findNodes(nodeIds: string[]): Promise<IServiceResponse<{ [nodeId: string]: IMediaNode }>> {
		const collection = await getNodeCollection(MongoDbConnection);
		const myquery = { _id: { $in: nodeIds } };
		const findResponse = await collection.find(myquery)

		const nodes: { [nodeId: string]: IMediaNode } = {}
		await findResponse.forEach(mongonode => {
			const nodeResponse = tryGetNode(mongonode)
			if (nodeResponse.success)
				nodes[nodeResponse.payload.nodeId] = nodeResponse.payload
		})

		if (Object.keys(nodes).length === 0) {
			return failureServiceResponse("Failed to find any nodes at that path.")
		}
		return successfulServiceResponse(nodes)
	},

	async deleteNode(nodeId: string): Promise<IServiceResponse<{}>> {
		const collection = await getNodeCollection(MongoDbConnection);
		const deleteResponse = await collection.deleteOne({ _id: nodeId })
		if (deleteResponse.result.ok) {
			return successfulServiceResponse({})
		}
		return failureServiceResponse('Failed to delete')
	},

	async deleteNodes(nodeIds: string[]): Promise<IServiceResponse<{}>> {
		const collection = await getNodeCollection(MongoDbConnection);
		const myquery = { _id: { $in: nodeIds } };
		const deleteResponse = await collection.deleteMany(myquery)
		if (deleteResponse.result.ok) {
			return successfulServiceResponse({})
		}
		return failureServiceResponse('Failed to update nodes')
	},

	async updateMediaURL(nodeId: string, newUrl: string): Promise<IServiceResponse<IMediaNode>> {
		if (!isValidHttpUrl(newUrl)) {
			return failureServiceResponse("URL is invalid")
		}
		const collection = await getNodeCollection(MongoDbConnection);
		const findResponse = await collection.findOne({ _id: nodeId })
		if (findResponse && findResponse._id === nodeId) {
			const tryCreateNodeResp = tryGetNode(findResponse)
			if (tryCreateNodeResp.success === true) {
				let node: IMediaNode = tryCreateNodeResp.payload
				node.mediaUrl = newUrl
				// convert to mongoNode and push it back
				const mongoMediaResp = getMongoNode(node)
				if (!mongoMediaResp.success) {
					return failureServiceResponse(mongoMediaResp.message)
				}
				const mongoNode = mongoMediaResp.payload
				try {
					// first delete, then add it back to the collection
					await collection.deleteOne({ _id: nodeId })
					const insertResponse = await collection.insertOne(mongoNode)
					if (insertResponse.result.ok) {
						return successfulServiceResponse(node)
					} else {
						return failureServiceResponse("Failed to insert new media node")
					}
				} catch (e) {
					return failureServiceResponse(`Failed to create new mediaNode, it's possible that a mediaNode with nodeId: ${node.nodeId} already exists.`)
				}
			}
			return failureServiceResponse("Found mediaNode, but failed to create IMediaNode object")
		}
		return failureServiceResponse("Failed to find node")
	}
};

export default MongoDatabaseConnection;
