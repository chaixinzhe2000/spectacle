import IPDFNodeDatabaseConnection from "../database/PDFNodeDatabaseConnection";
import {
	IServiceResponse,
	failureServiceResponse,
	getServiceResponse,
	IPDFNode,
	IPDFNodeGateway,
} from "spectacle-interfaces";


// TODO: completed by Chai
export default class PDFNodeGateway implements IPDFNodeGateway {
	dbConnection: IPDFNodeDatabaseConnection;

	constructor(nodeDbConnection: IPDFNodeDatabaseConnection) {
		this.dbConnection = nodeDbConnection;
	}

	async createNode(node: IPDFNode): Promise<IServiceResponse<IPDFNode>> {
		if (node.pdfUrl !== undefined && typeof node.pdfUrl === 'string' &&
			node.nodeId !== undefined && typeof node.nodeId === 'string') {
			const createResponse = await this.dbConnection.insertNode(node)
			return getServiceResponse(createResponse)
		} else {
			return failureServiceResponse("Invalid IPDFNode")
		}
	}

	async getNode(nodeId: string): Promise<IServiceResponse<IPDFNode>> {
		return await this.dbConnection.findNode(nodeId);
	}

	async deleteNode(nodeId: string): Promise<IServiceResponse<{}>> {
		return await this.dbConnection.deleteNode(nodeId);
	}

	async deleteNodes(nodeIds: string[]): Promise<IServiceResponse<{}>> {
		return await this.dbConnection.deleteNodes(nodeIds);
    }
    
    async updateNode(nodeId: string, newUrl: string): Promise<IServiceResponse<IPDFNode>> {
        return await this.dbConnection.updatePDFURL(nodeId, newUrl);
    }
}
