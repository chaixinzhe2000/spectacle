import { ITestPDFNodeDatabaseConnection } from "../PDFNodeDatabaseConnection";
import MongoDbConnection from "../../../mongodbConnection";
import {
	IServiceResponse,
	successfulServiceResponse,
	failureServiceResponse,
	IPDFNode,
	getServiceResponse,
} from "spectacle-interfaces";
import { getMongoNode, IMongoIPDFNode, tryGetNode } from "../helpers";
import { getNodeCollection } from "./getCollection";

// TODO: completed by Chai
const MongoDatabaseConnection: ITestPDFNodeDatabaseConnection = {
	async clearNodeCollection(): Promise<IServiceResponse<{}>> {
		const collection = await getNodeCollection(MongoDbConnection);
		const response = await collection.deleteMany({});
		if (response.result.ok) {
			return successfulServiceResponse({});
		}
		return failureServiceResponse("Failed to clear node collection.");
	},

	async initNodes(nodes: IPDFNode[]): Promise<IServiceResponse<{}>> {
		const mongoNodes: IMongoIPDFNode[] = []

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

	async insertNode(node: IPDFNode): Promise<IServiceResponse<IPDFNode>> {

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

	async findNode(nodeId: string): Promise<IServiceResponse<IPDFNode>> {

		const collection = await getNodeCollection(MongoDbConnection);
		const findResponse = await collection.findOne({ _id: nodeId })

		if (findResponse && findResponse._id === nodeId) {
			const tryCreateNodeResp = tryGetNode(findResponse)
			return getServiceResponse(tryCreateNodeResp, "Failed to find node\n")
		}
		return failureServiceResponse("Failed to find nodes")
	},

	async findNodes(nodeIds: string[]): Promise<IServiceResponse<{ [nodeId: string]: IPDFNode }>> {
		const collection = await getNodeCollection(MongoDbConnection);
		const myquery = { _id: { $in: nodeIds } };
		const findResponse = await collection.find(myquery)

		const nodes: { [nodeId: string]: IPDFNode } = {}
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

	async updatePDFURL(nodeId: string, newUrl: string): Promise<IServiceResponse<IPDFNode>> {
		const collection = await getNodeCollection(MongoDbConnection);
		const findResponse = await collection.findOne({ _id: nodeId })
		if (findResponse && findResponse._id === nodeId) {
			const tryCreateNodeResp = tryGetNode(findResponse)
			if (tryCreateNodeResp.success === true) {
				let node: IPDFNode = tryCreateNodeResp.payload
				node.pdfUrl = newUrl
				// convert to mongoNode and push it back
				const mongoPDFResp = getMongoNode(node)
				if (!mongoPDFResp.success) {
					return failureServiceResponse(mongoPDFResp.message)
				}
				const mongoNode = mongoPDFResp.payload
				try {
					// first delete, then add it back to the collection
					await collection.deleteOne({ _id: nodeId })
					const insertResponse = await collection.insertOne(mongoNode)
					if (insertResponse.result.ok) {
						return successfulServiceResponse(node)
					} else {
						return failureServiceResponse("Failed to insert new PDF node")
					}
				} catch (e) {
					return failureServiceResponse(`Failed to create new PDFNode, it's possible that a PDFNode with nodeId: ${node.nodeId} already exists.`)
				}
			}
			return failureServiceResponse("Found PDFNode, but failed to create IPDFNode object")
		}
		return failureServiceResponse("Failed to find node")
	}
};

export default MongoDatabaseConnection;
