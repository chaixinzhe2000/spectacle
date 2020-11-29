import { IServiceResponse, IImmutableGridNode, IMediaNode } from "apposition-interfaces"

export default interface IMediaNodeDatabaseConnection {
	insertNode(node: IMediaNode): Promise<IServiceResponse<IMediaNode>>;
	findNode(nodeId: string): Promise<IServiceResponse<IMediaNode>>;
	findNodes(nodeIds: string[]): Promise<IServiceResponse<{ [nodeId: string]: IMediaNode }>>;
	deleteNode(nodeId: string): Promise<IServiceResponse<{}>>;
	deleteNodes(nodeIds: string[]): Promise<IServiceResponse<{}>>;
}

export interface ITestNodeDatabaseConnection extends IMediaNodeDatabaseConnection {
	clearNodeCollection(): Promise<IServiceResponse<{}>>
	initNodes(nodes: IMediaNode[]): Promise<IServiceResponse<{}>>
}