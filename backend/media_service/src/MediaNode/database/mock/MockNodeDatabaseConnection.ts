import INodeDatabaseConnection, { ITestMediaNodeDatabaseConnection } from "../MediaNodeDatabaseConnection";
import { Collection } from 'mongodb';
import { IServiceResponse, successfulServiceResponse, failureServiceResponse, getServiceResponse, IMediaNode } from "spectacle-interfaces"
import { getMongoNode, IMongoIMediaNode, tryGetNode } from "../helpers";
import { getMongoAnchor } from "../../../MediaAnchor/database/helpers";
import { promises } from "dns";

function isValidHttpUrl(urlString: string) {
	let url;
	try {
		url = new URL(urlString);
	} catch (_) {
		return false;
	}
	return url.protocol === "http:" || url.protocol === "https:";
}

// TODO: completed by Chai
class MockDatabaseConnection implements ITestMediaNodeDatabaseConnection {

	_nodes: { [nodeId: string]: IMongoIMediaNode }
	constructor() {
		this._nodes = {}
		this.clearNodeCollection = this.clearNodeCollection.bind(this);
		this.initNodes = this.initNodes.bind(this);
		this.insertNode = this.insertNode.bind(this);
		this.findNode = this.findNode.bind(this);
		this.findNodes = this.findNodes.bind(this);
		this.deleteNode = this.deleteNode.bind(this);
		this.deleteNodes = this.deleteNodes.bind(this);
		this.updateMediaURL = this.updateMediaURL.bind(this);
	}

	async clearNodeCollection(): Promise<IServiceResponse<{}>> {
		this._nodes = {}
		return successfulServiceResponse({})
	}

	async initNodes(nodes: IMediaNode[]): Promise<IServiceResponse<{}>> {
		nodes.forEach(node => {
			const mongoNodeResp = getMongoNode(node)
			if (!mongoNodeResp.success) {
				return failureServiceResponse(mongoNodeResp.message)
			}
			this._nodes[node.nodeId] = mongoNodeResp.payload
		})
		return successfulServiceResponse({})
	}

	async insertNode(node: IMediaNode): Promise<IServiceResponse<IMediaNode>> {

		const mongoNodeResp = getMongoNode(node)
		if (!mongoNodeResp.success) {
			return failureServiceResponse(mongoNodeResp.message)
		} if (this._nodes[node.nodeId])
			return failureServiceResponse("Node already exists")
		this._nodes[node.nodeId] = mongoNodeResp.payload
		return successfulServiceResponse(node)
	}

	async findNode(nodeId: string): Promise<IServiceResponse<IMediaNode>> {

		const node = this._nodes[nodeId]

		if (node) {
			const tryCreateNodeResp = tryGetNode(node)
			return getServiceResponse(tryCreateNodeResp, "Failed to find node\n")
		}

		return failureServiceResponse("Failed to find nodes")

	}

	async findNodes(nodeIds: string[]): Promise<IServiceResponse<{ [nodeId: string]: IMediaNode }>> {
		const nodes: { [nodeId: string]: IMediaNode } = {}

		async function findAndAdd(nodeId: string, findNode: Function) {
			const findResponse = await findNode(nodeId)
			if (findResponse.success)
				nodes[findResponse.payload.nodeId] = findResponse.payload
		}

		await Promise.all(nodeIds.map(nodeId => {
			return findAndAdd(nodeId, this.findNode)
		}));

		if (Object.keys(nodes).length === 0) {
			return failureServiceResponse("Failed to find any nodes.")
		}

		return successfulServiceResponse(nodes)
	}

	async deleteNode(nodeId: string): Promise<IServiceResponse<{}>> {
		delete this._nodes[nodeId]
		return successfulServiceResponse({})
	}

	async deleteNodes(nodeIds: string[]): Promise<IServiceResponse<{}>> {
		nodeIds.forEach(nid => delete this._nodes[nid])
		return successfulServiceResponse({})
	}

	async updateMediaURL(nodeId: string, newUrl: string): Promise<IServiceResponse<IMediaNode>> {
		if (!isValidHttpUrl(newUrl)) {
			return failureServiceResponse("URL is invalid")
		}
		let mongoNode = this._nodes[nodeId]
		const tryCreateNodeResp = tryGetNode(mongoNode)
		if (tryCreateNodeResp.success === true) {
			let node: IMediaNode = tryCreateNodeResp.payload
			node.mediaUrl = newUrl
			// convert to mongoNode and push it back
			const mongoMediaResp = getMongoNode(node)
			if (!mongoMediaResp.success) {
				return failureServiceResponse(mongoMediaResp.message)
			}
			const newMongoNode = mongoMediaResp.payload
			try {
				// first delete, then add it back to the collection
				delete this._nodes[node.nodeId]
				this._nodes[node.nodeId] = newMongoNode
			} catch (e) {
				return failureServiceResponse(`Failed to create new mediaNode, it's possible that a mediaNode with nodeId: ${node.nodeId} already exists.`)
			}
		}
		return failureServiceResponse("Found mediaNode, but failed to create IMediaNode object")
	}
}

export default MockDatabaseConnection