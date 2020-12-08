import { IServiceResponse, IPDFNode } from "spectacle-interfaces"

export default interface IPDFNodeDatabaseConnection {
	insertNode(node: IPDFNode): Promise<IServiceResponse<IPDFNode>>;
	findNode(nodeId: string): Promise<IServiceResponse<IPDFNode>>;
	findNodes(nodeIds: string[]): Promise<IServiceResponse<{ [nodeId: string]: IPDFNode }>>;
	deleteNode(nodeId: string): Promise<IServiceResponse<{}>>;
    deleteNodes(nodeIds: string[]): Promise<IServiceResponse<{}>>;
    updatePDFURL(nodeId: string, newUrl: string): Promise<IServiceResponse<IPDFNode>>;
}

export interface ITestPDFNodeDatabaseConnection extends IPDFNodeDatabaseConnection {
	clearNodeCollection(): Promise<IServiceResponse<{}>>
	initNodes(nodes: IPDFNode[]): Promise<IServiceResponse<{}>>
}