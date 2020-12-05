import {
	failureServiceResponse,
	IServiceResponse,
	successfulServiceResponse,
	ILink,
} from "spectacle-interfaces";

export interface IMongoLink {
	_id: string; // replaces linkId
	srcAnchorId?: string;
	destAnchorId?: string;
	srcNodeId?: string;
	destNodeId?: string;
	createdAt?: Date;
}

function isLink(link: ILink): boolean {
	try {
        let fieldCount: number = 0
		if (link.srcAnchorId !== undefined && link.srcNodeId !== null && typeof link.srcAnchorId === "string" && link.srcAnchorId.length > 0)
			fieldCount++
		if (link.destAnchorId !== undefined && link.srcNodeId !== null && typeof link.srcAnchorId === "string" && link.srcAnchorId.length > 0)
			fieldCount++
		if (link.srcNodeId !== undefined && link.srcNodeId !== null && typeof link.srcAnchorId === "string" && link.srcAnchorId.length > 0)
			fieldCount++
		if (link.destNodeId !== undefined && link.srcNodeId !== null && typeof link.srcAnchorId === "string" && link.srcAnchorId.length > 0)
            fieldCount++
		if (fieldCount === 2)
			return true
		return false
	} catch {
		return false
	}
}
export function getMongoLink(link: ILink): IServiceResponse<IMongoLink> {
	try {
        if (!isLink(link)){
            return failureServiceResponse(
                "Input to getMongoLink is not valid."
            );
        }
		let mongolink: IMongoLink = {
			_id: link.linkId.toLocaleLowerCase(),
			srcAnchorId: link.srcAnchorId,
			destAnchorId: link.destAnchorId,
			srcNodeId: link.srcNodeId,
			destNodeId: link.destNodeId,
			createdAt: new Date(),
        };
        const tryMongoLinkResponse = tryGetLink(mongolink)
		if (tryGetLink(mongolink).success) {
			return successfulServiceResponse(mongolink);
        }
		return failureServiceResponse(
			"Failed to parse ILink into IMongoNode, verify that the ILink passed in is valid."
		);
	} catch {
		return failureServiceResponse(
			"Failed to parse ILink into IMongoNode, verify that the ILink passed in is valid."
		);
	}
}

export function tryGetLink(mongoLink: IMongoLink): IServiceResponse<ILink> {
	if (mongoLink._id !== undefined && typeof mongoLink._id === "string" &&
        mongoLink._id.length > 0)
		return successfulServiceResponse({
			linkId: mongoLink._id,
			srcAnchorId: mongoLink.srcAnchorId,
			destAnchorId: mongoLink.destAnchorId,
			srcNodeId: mongoLink.srcNodeId,
			destNodeId: mongoLink.destNodeId,
        });
	return failureServiceResponse("Invalid link");
}
