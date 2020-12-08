import IAnchorDatabaseConnection from "../database/IAnchorDatabaseConnection"
import { IServiceResponse, IAnchor, IAnchorGateway } from "spectacle-interfaces"

export default class AnchorGateway implements IAnchorGateway {

	dbConnection: IAnchorDatabaseConnection

	// TODO: completed by Chai
	constructor(anchorDbConnection: IAnchorDatabaseConnection) {
		this.dbConnection = anchorDbConnection
	}

	async updateLastAnnotation(anchorId: string, annotation: string, author: string): Promise<IServiceResponse<IAnchor>> {
		return await this.dbConnection.updateLastAnnotation(anchorId, annotation, author)
	}

	async addNewAnnotation(anchorId: string, annotation: string, author: string): Promise<IServiceResponse<IAnchor>> {
		return await this.dbConnection.addNewAnnotation(anchorId, annotation, author)
	}

	async createAnchor(anchor: IAnchor): Promise<IServiceResponse<IAnchor>> {
		return await this.dbConnection.insertAnchor(anchor)
	}

	async getAnchor(anchorId: string): Promise<IServiceResponse<IAnchor>> {
		return await this.dbConnection.findAnchor(anchorId)
	}

	async getAnchors(anchorIds: string[]): Promise<IServiceResponse<{ [anchorId: string]: IAnchor }>>{
		return await this.dbConnection.findAnchors(anchorIds)
	}

	async getNodeAnchors(nodeId: string): Promise<IServiceResponse<{ [anchorId: string]: IAnchor }>> {
		return await this.dbConnection.findAnchorsByNode(nodeId)
	}

	async deleteAnchor(anchorId: string): Promise<IServiceResponse<{}>> {
		return await this.dbConnection.deleteAnchor(anchorId)
	}

	async deleteNodeAnchors(nodeId: string): Promise<IServiceResponse<{}>> {
		return await this.dbConnection.deleteAnchorsByNode(nodeId)
	}
}