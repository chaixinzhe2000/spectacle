import IMediaAnchorDatabaseConnection from "../database/IMediaAnchorDatabaseConnection";
import {
	IServiceResponse,
	failureServiceResponse,
	IMediaAnchorGateway,
	IMediaAnchor
} from "apposition-interfaces";

// TODO: completed by Chai
export default class MediaAnchorGateway implements IMediaAnchorGateway {
	
	dbConnection: IMediaAnchorDatabaseConnection

	constructor(nodeDbConnection: IMediaAnchorDatabaseConnection) {
		this.dbConnection = nodeDbConnection
	}

	async createAnchor(anchor: IMediaAnchor): Promise<IServiceResponse<IMediaAnchor>> {
		try {
			if (anchor.mediaTimeStamp !== null && typeof anchor.mediaTimeStamp === 'number' ) {
				return await this.dbConnection.insertAnchor(anchor)
			} else {
				return failureServiceResponse("mediaTimeStamp field is missing")
			}
		} catch {
			return failureServiceResponse("Failed to parse IMediaAnchor.")
		}
	}

	/**
	 * Gets a Node (and it's children) from the database by node id.
	 * 
	 * @param nodeId - id of node to retrieve
	 * 
	 * Returns a failure service response if:
	 *  - the id does not exist in the database
	 */
	async getAnchor(anchorId: string): Promise<IServiceResponse<IMediaAnchor>> {
		return await this.dbConnection.findAnchor(anchorId)
	}

	async getAnchors(anchorIds: string[]): Promise<IServiceResponse<{ [anchorId: string]: IMediaAnchor }>> {
		return await this.dbConnection.findAnchors(anchorIds)
	}

	/**
	 * Deletes a node in the database.
	 * 
	 * @param nodeId - id of node to delete
	 * 
	 * Returns a successful service response if:
	 *  - the node no longer exists in the database, even if already it didn't exist before
	 * 
	 * Returns a failure service response if:
	 *  - the database fails to delete the node
	 */
	async deleteAnchor(anchorId: string): Promise<IServiceResponse<{}>> {
		return await this.dbConnection.deleteAnchor(anchorId)
	}

	async deleteAnchors(anchorIds: string[]): Promise<IServiceResponse<{}>> {
		return await this.dbConnection.deleteAnchors(anchorIds)
	}
}
