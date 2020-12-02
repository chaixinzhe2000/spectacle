import IAnchorDatabaseConnection from "../database/IAnchorDatabaseConnection"
import { IServiceResponse, IAnchor, IAnchorGateway } from "spectacle-interfaces"

export default class AnchorGateway implements IAnchorGateway {

	dbConnection: IAnchorDatabaseConnection

	// TODO: completed by Chai
	constructor(anchorDbConnection: IAnchorDatabaseConnection) {
		this.dbConnection = anchorDbConnection
	}
	async updateAnchorContent(anchorId: string, content: string): Promise<IServiceResponse<IAnchor>> {
		return await this.dbConnection.updateAnchorContent(anchorId, content)
	}
	
	async updateCreatedTimeStamp(anchorId: string): Promise<IServiceResponse<IAnchor>> {
		return await this.dbConnection.updateAnchorCreatedTime(anchorId)
	}

	async createAnchor(anchor: IAnchor): Promise<IServiceResponse<IAnchor>> {
		return await this.dbConnection.insertAnchor(anchor)
	}

	/**
	 * Gets a Anchor (and it's children) from the database by anchor id.
	 * 
	 * @param anchorId - id of anchor to retrieve
	 * 
	 * Returns a failure service response if:
	 *  - the id does not exist in the database
	 */
	async getAnchor(anchorId: string): Promise<IServiceResponse<IAnchor>> {
		return await this.dbConnection.findAnchor(anchorId)
	}

	async getNodeAnchors(nodeId: string): Promise<IServiceResponse<{ [anchorId: string]: IAnchor }>> {
		return await this.dbConnection.findAnchorsByNode(nodeId)
	}

	/**
	 * Deletes a anchor in the database.
	 * 
	 * @param anchorId - id of anchor to delete
	 * 
	 * Returns a successful service response if:
	 *  - the anchor no longer exists in the database, even if already it didn't exist before
	 * 
	 * Returns a failure service response if:
	 *  - the database fails to delete the anchor
	 */
	async deleteAnchor(anchorId: string): Promise<IServiceResponse<{}>> {
		return await this.dbConnection.deleteAnchor(anchorId)
	}

	/**
	 * Deletes all anchors with the given node ID in the database.
	 * 
	 * @param anchorId - id of anchor to delete
	 * 
	 * Returns a successful service response if:
	 *  - the anchor no longer exists in the database, even if already it didn't exist before
	 * 
	 * Returns a failure service response if:
	 *  - no anchors with the given nodeId are found
	 *  - the database fails to delete an anchor
	 */
	async deleteNodeAnchors(nodeId: string): Promise<IServiceResponse<{}>> {
		return await this.dbConnection.deleteAnchorsByNode(nodeId)
	}
}