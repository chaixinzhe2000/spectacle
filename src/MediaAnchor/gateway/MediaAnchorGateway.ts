import IMediaAnchorDatabaseConnection from "../database/IMediaAnchorDatabaseConnection";
import {
	IServiceResponse,
	failureServiceResponse,
	IMediaAnchorGateway,
	IMediaAnchor
} from "spectacle-interfaces";

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

	async getAnchor(anchorId: string): Promise<IServiceResponse<IMediaAnchor>> {
		return await this.dbConnection.findAnchor(anchorId)
	}

	async getAnchors(anchorIds: string[]): Promise<IServiceResponse<{ [anchorId: string]: IMediaAnchor }>> {
		return await this.dbConnection.findAnchors(anchorIds)
	}

	async deleteAnchor(anchorId: string): Promise<IServiceResponse<{}>> {
		return await this.dbConnection.deleteAnchor(anchorId)
	}

	async deleteAnchors(anchorIds: string[]): Promise<IServiceResponse<{}>> {
		return await this.dbConnection.deleteAnchors(anchorIds)
	}
}
