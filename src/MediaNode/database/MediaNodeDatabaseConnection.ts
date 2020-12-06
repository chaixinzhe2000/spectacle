import { IServiceResponse, IMediaNode } from "spectacle-interfaces"

export default interface IMediaNodeDatabaseConnection {
	insertNode(node: IMediaNode): Promise<IServiceResponse<IMediaNode>>;
	findNode(nodeId: string): Promise<IServiceResponse<IMediaNode>>;
	findNodes(nodeIds: string[]): Promise<IServiceResponse<{ [nodeId: string]: IMediaNode }>>;
	deleteNode(nodeId: string): Promise<IServiceResponse<{}>>;
    deleteNodes(nodeIds: string[]): Promise<IServiceResponse<{}>>;
    updateMediaURL(nodeId: string, newUrl: string): Promise<IServiceResponse<IMediaNode>>;
}

export interface ITestMediaNodeDatabaseConnection extends IMediaNodeDatabaseConnection {
	clearNodeCollection(): Promise<IServiceResponse<{}>>
	initNodes(nodes: IMediaNode[]): Promise<IServiceResponse<{}>>
}