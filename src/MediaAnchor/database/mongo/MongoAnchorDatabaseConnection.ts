import { ITestMediaAnchorDatabaseConnection } from "../IMediaAnchorDatabaseConnection";
import MongoDbConnection from "../../../mongodbConnection";
import {
	IServiceResponse,
	successfulServiceResponse,
	failureServiceResponse,
	getServiceResponse,
	IMediaAnchor
} from "spectacle-interfaces";
import {
	getMongoAnchor,
	IMongoIMediaAnchor,
	tryGetAnchor,
} from "../helpers";
import { getCollection } from "./getCollection";


// TODO: completed by Chai
const MongoDatabaseConnection: ITestMediaAnchorDatabaseConnection = {
	async clearAnchorCollection(): Promise<IServiceResponse<{}>> {
		const collection = await getCollection(MongoDbConnection);
		const response = await collection.deleteMany({})
		if (response.result.ok) {
			return successfulServiceResponse({})
		}
		return failureServiceResponse("Failed to clear anchor collection.")
	},

	async initAnchors(anchors: IMediaAnchor[]): Promise<IServiceResponse<{}>> {
		const mongoAnchors: IMongoIMediaAnchor[] = []
		anchors.forEach(anchor => {
			const mongoAnchorResp = getMongoAnchor(anchor)
			if (!mongoAnchorResp.success) {
				return failureServiceResponse(mongoAnchorResp.message)
			}
			mongoAnchors.push(mongoAnchorResp.payload)
		})
		try {
			const collection = await getCollection(MongoDbConnection);
			const insertResponse = await collection.insertMany(mongoAnchors)
			if (insertResponse.result.ok) {
				return successfulServiceResponse({})
			}
		} catch (e) {
			return failureServiceResponse(`Failed to create new anchors.`)
		}
	},

	async insertAnchor(anchor: IMediaAnchor): Promise<IServiceResponse<IMediaAnchor>> {
		const mongoAnchorResp = getMongoAnchor(anchor)
		if (!mongoAnchorResp.success) {
			return failureServiceResponse(mongoAnchorResp.message)
		}
		const mongoAnchor = mongoAnchorResp.payload
		try {
			const collection = await getCollection(MongoDbConnection);
			const insertResponse = await collection.insertOne(mongoAnchor)
			if (insertResponse.result.ok) {
				return successfulServiceResponse(anchor)
			}
		} catch (e) {
			return failureServiceResponse(`Failed to create new anchor, it's possible that a anchor with anchorId: ${anchor.anchorId} already exists.`)
		}

	},

	async findAnchor(anchorId: string): Promise<IServiceResponse<IMediaAnchor>> {
		const collection = await getCollection(MongoDbConnection);
		const findResponse = await collection.findOne({ _id: anchorId })
		if (findResponse && findResponse._id === anchorId) {
			const tryCreateAnchorResp = tryGetAnchor(findResponse)
			return getServiceResponse(tryCreateAnchorResp, "Failed to find anchor\n")
		}
		return failureServiceResponse("Failed to find anchors")

	},

	async findAnchors(anchorIds: string[]): Promise<IServiceResponse<{ [anchorId: string]: IMediaAnchor }>> {
		if (anchorIds === null) return failureServiceResponse("anchorIds is null");
		const collection = await getCollection(MongoDbConnection);
		const myquery = { _id: { $in: anchorIds } };
		const findResponse = await collection.find(myquery);

		const anchors: { [anchorId: string]: IMediaAnchor } = {};
		await findResponse.forEach((mongoAnchor) => {
			const linkResponse = tryGetAnchor(mongoAnchor);
			if (linkResponse.success)
				anchors[linkResponse.payload.anchorId] = linkResponse.payload;
		});

		if (Object.keys(anchors).length === 0) {
			return failureServiceResponse("Failed to find any links at that path.");
		}
		return successfulServiceResponse(anchors);
	},

	async deleteAnchor(anchorId: string): Promise<IServiceResponse<{}>> {
		const collection = await getCollection(MongoDbConnection);
		const deleteResponse = await collection.deleteOne({ _id: anchorId })
		if (deleteResponse.result.ok) {
			return successfulServiceResponse({})
		}
		return failureServiceResponse('Failed to delete')
	},

	async deleteAnchors(anchorIds: string[]): Promise<IServiceResponse<{}>> {
		const collection = await getCollection(MongoDbConnection);
		const myquery = { _id: { $in: anchorIds } };
		const deleteResponse = await collection.deleteMany(myquery)
		if (deleteResponse.result.ok) {
			return successfulServiceResponse({})
		}
		return failureServiceResponse('Failed to update anchors')
	}
};

export default MongoDatabaseConnection;
