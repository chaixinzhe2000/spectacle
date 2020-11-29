import { IServiceResponse } from "hypertext-interfaces"


// TODO
export default interface IAnchorDatabaseConnection {}

export interface ITestIAnchorDatabaseConnection extends IAnchorDatabaseConnection {
  clearAnchorCollection(): Promise<IServiceResponse<{}>>
  // initAnchors(anchors: Anchor[]): Promise<IServiceResponse<{}>>
}