import {
  failureServiceResponse,
  IImmutableGridAnchor,
  IServiceResponse,
  successfulServiceResponse,
} from "hypertext-interfaces";

export interface IMongoAnchor {
  _id: string; // replaces anchorId
  // TODO
}

export function getMongoAnchor(
  // replace with anchor interface
  anchor: unknown
): IServiceResponse<IMongoAnchor> {
  // TODO
  return failureServiceResponse("Not yet implemented.")
}

export function tryGetAnchor(
  mongoAnchor: IMongoAnchor
): 
// replace with anchor interface
IServiceResponse<unknown> {
  // TODO
  return failureServiceResponse("Not yet implemented.")
}
