import { IServiceResponse, IImmutableGridNode } from "hypertext-interfaces"


// TODO
export default interface INodeDatabaseConnection {}

export interface ITestNodeDatabaseConnection extends INodeDatabaseConnection {
  clearNodeCollection(): Promise<IServiceResponse<{}>>
  // initNodes(nodes: nodes[]): Promise<IServiceResponse<{}>>
}