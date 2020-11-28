import {
  failureServiceResponse,
  IServiceResponse,
  successfulServiceResponse,
  ILink,
} from "hypertext-interfaces";

export interface IMongoLink {
  _id: string; // replaces linkId
  srcAnchorId: string;
  destAnchorId: string;
  srcNodeId: string;
  destNodeId: string;
  createdAt?: Date;
}

export function getMongoLink(link: ILink): IServiceResponse<IMongoLink> {
  try {
    let mongolink: IMongoLink = {
      _id: link.linkId.toLocaleLowerCase(),
      srcAnchorId: link.srcAnchorId,
      destAnchorId: link.destAnchorId,
      srcNodeId: link.srcNodeId,
      destNodeId: link.destNodeId,
      createdAt: new Date(),
    };
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
  if (
    mongoLink._id !== undefined &&
    typeof mongoLink._id === "string" &&
    mongoLink._id.length > 0 &&
    mongoLink.srcAnchorId !== undefined &&
    typeof mongoLink.srcAnchorId === "string" &&
    mongoLink.srcAnchorId.length > 0 &&
    mongoLink.destAnchorId !== undefined &&
    typeof mongoLink.destAnchorId === "string" &&
    mongoLink.destAnchorId.length > 0 &&
    mongoLink.srcNodeId !== undefined &&
    typeof mongoLink.srcNodeId === "string" &&
    mongoLink.srcNodeId.length > 0 &&
    mongoLink.destNodeId !== undefined &&
    typeof mongoLink.destNodeId === "string" &&
    mongoLink.destNodeId.length > 0
  )
    return successfulServiceResponse({
      linkId: mongoLink._id,
      srcAnchorId: mongoLink.srcAnchorId,
      destAnchorId: mongoLink.destAnchorId,
      srcNodeId: mongoLink.srcNodeId,
      destNodeId: mongoLink.destNodeId,
    });
  return failureServiceResponse("Invalid node");
}
