import {
  failureServiceResponse,
  IServiceResponse,
  successfulServiceResponse,
  IImmutableGridNode,
} from "hypertext-interfaces";

export interface IMongoNode {
  _id: string; // replaces nodeId
}

export function getMongoNode(
  // replace with node type
  node: unknown
): IServiceResponse<IMongoNode> {
  //TODO
  return failureServiceResponse("Not yet implemented.")
}

export function getNode(
  mongoNode: IMongoNode
): IServiceResponse<IImmutableGridNode> {
  //TODO
  return failureServiceResponse("Not yet implemented.")
}
