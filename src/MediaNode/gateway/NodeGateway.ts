import IMediaNodeDatabaseConnection from "../database/MediaNodeDatabaseConnection";
import {
	IServiceResponse,
	failureServiceResponse,
	getServiceResponse,
	IMediaNode,
	IMediaAnchor,
	IMediaNodeGateway,
} from "spectacle-interfaces";


// TODO: completed by Chai
export default class MediaNodeGateway implements IMediaNodeGateway {
	dbConnection: IMediaNodeDatabaseConnection;

	constructor(nodeDbConnection: IMediaNodeDatabaseConnection) {
		this.dbConnection = nodeDbConnection;
	}

	async createNode(node: IMediaNode): Promise<IServiceResponse<IMediaNode>> {
		if (node.mediaUrl !== undefined && typeof node.mediaUrl === 'string' &&
			node.nodeId !== undefined && typeof node.nodeId === 'string') {
			const createResponse = await this.dbConnection.insertNode(node)
			return getServiceResponse(createResponse)
		} else {
			return failureServiceResponse("Invalid IMediaNode")
		}
	}

	async getNode(nodeId: string): Promise<IServiceResponse<IMediaNode>> {
		return await this.dbConnection.findNode(nodeId);
	}

	async deleteNode(nodeId: string): Promise<IServiceResponse<{}>> {
		return await this.dbConnection.deleteNode(nodeId);
	}

	async deleteNodes(nodeIds: string[]): Promise<IServiceResponse<{}>> {
		return await this.dbConnection.deleteNodes(nodeIds);
	}
}
