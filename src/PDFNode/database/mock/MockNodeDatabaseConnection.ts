import INodeDatabaseConnection, { ITestPDFNodeDatabaseConnection } from "../PDFNodeDatabaseConnection";
import { Collection } from 'mongodb';
import { IServiceResponse, successfulServiceResponse, failureServiceResponse, getServiceResponse, IPDFNode } from "spectacle-interfaces"
import { getMongoNode, IMongoIPDFNode, tryGetNode } from "../helpers";
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
class MockDatabaseConnection implements ITestPDFNodeDatabaseConnection {

	_nodes: { [nodeId: string]: IMongoIPDFNode }
	constructor() {
		this._nodes = {}
		this.clearNodeCollection = this.clearNodeCollection.bind(this);
		this.initNodes = this.initNodes.bind(this);
		this.insertNode = this.insertNode.bind(this);
		this.findNode = this.findNode.bind(this);
		this.findNodes = this.findNodes.bind(this);
		this.deleteNode = this.deleteNode.bind(this);
		this.deleteNodes = this.deleteNodes.bind(this);
		this.updatePDFURL = this.updatePDFURL.bind(this);
	}

	async clearNodeCollection(): Promise<IServiceResponse<{}>> {
		this._nodes = {}
		return successfulServiceResponse({})
	}

	async initNodes(nodes: IPDFNode[]): Promise<IServiceResponse<{}>> {
		nodes.forEach(node => {
			const mongoNodeResp = getMongoNode(node)
			if (!mongoNodeResp.success) {
				return failureServiceResponse(mongoNodeResp.message)
			}
			this._nodes[node.nodeId] = mongoNodeResp.payload
		})
		return successfulServiceResponse({})
	}

	async insertNode(node: IPDFNode): Promise<IServiceResponse<IPDFNode>> {

		const mongoNodeResp = getMongoNode(node)
		if (!mongoNodeResp.success) {
			return failureServiceResponse(mongoNodeResp.message)
		} if (this._nodes[node.nodeId])
			return failureServiceResponse("Node already exists")
		this._nodes[node.nodeId] = mongoNodeResp.payload
		return successfulServiceResponse(node)
	}

	async findNode(nodeId: string): Promise<IServiceResponse<IPDFNode>> {

		const node = this._nodes[nodeId]

		if (node) {
			const tryCreateNodeResp = tryGetNode(node)
			return getServiceResponse(tryCreateNodeResp, "Failed to find node\n")
		}

		return failureServiceResponse("Failed to find nodes")

	}

	async findNodes(nodeIds: string[]): Promise<IServiceResponse<{ [nodeId: string]: IPDFNode }>> {
		const nodes: { [nodeId: string]: IPDFNode } = {}

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

	async updatePDFURL(nodeId: string, newUrl: string): Promise<IServiceResponse<IPDFNode>> {
		if (!isValidHttpUrl(newUrl)) {
			return failureServiceResponse("URL is invalid")
		}
		let mongoNode = this._nodes[nodeId]
		const tryCreateNodeResp = tryGetNode(mongoNode)
		if (tryCreateNodeResp.success === true) {
			let node: IPDFNode = tryCreateNodeResp.payload
			node.pdfUrl = newUrl
			// convert to mongoNode and push it back
			const mongoPDFResp = getMongoNode(node)
			if (!mongoPDFResp.success) {
				return failureServiceResponse(mongoPDFResp.message)
			}
			const newMongoNode = mongoPDFResp.payload
			try {
				// first delete, then add it back to the collection
				delete this._nodes[node.nodeId]
				this._nodes[node.nodeId] = newMongoNode
			} catch (e) {
				return failureServiceResponse(`Failed to create new PDFNode, it's possible that a PDFNode with nodeId: ${node.nodeId} already exists.`)
			}
		}
		return failureServiceResponse("Found PDFNode, but failed to create IPDFNode object")
	}
}

export default MockDatabaseConnection