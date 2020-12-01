import {
	failureServiceResponse,
	IMediaAnchor,
	IServiceResponse,
	successfulServiceResponse,
} from "spectacle-interfaces";

// TODO: completed by Chai
export interface IMongoIMediaAnchor {
	_id: string; // replaces anchorId
	mediaTimeStamp: number;
	createdAt?: Date
}

export function getMongoAnchor(anchor: IMediaAnchor): IServiceResponse<IMongoIMediaAnchor> {
	try {
        let mongoAnchor: IMongoIMediaAnchor = {
            _id: anchor.anchorId.toLocaleLowerCase(),
            mediaTimeStamp: anchor.mediaTimeStamp,
            createdAt: new Date()
        }

        if (tryGetAnchor(mongoAnchor).success)
            return successfulServiceResponse(mongoAnchor)
        else
            return failureServiceResponse("Failed to parse IMediaAnchor into IMongoIMediaAnchor, verify that the IMediaAnchor passed in is valid.")
    } catch {
        return failureServiceResponse("Failed to parse IMediaAnchor into IMongoIMediaAnchor, verify that the IMediaAnchor passed in is valid.")
    }
}

export function tryGetAnchor(mongoAnchor: IMongoIMediaAnchor): IServiceResponse<IMediaAnchor> {
	if (mongoAnchor.mediaTimeStamp !== undefined && typeof mongoAnchor.mediaTimeStamp === 'number') {
        return successfulServiceResponse({
            anchorId: mongoAnchor._id,
            mediaTimeStamp: mongoAnchor.mediaTimeStamp
        })}
	return failureServiceResponse("Not yet implemented.")
}
