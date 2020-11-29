import { INode, IFilePath, IServiceResponse } from "hypertext-interfaces"

export default interface INodeDatabaseConnection {

  insertNode(node: INode): Promise<IServiceResponse<INode>>;

  findNode(nodeId: string): Promise<IServiceResponse<INode>>;

  findNodes(filePath: IFilePath): Promise<IServiceResponse<INode[]>>;

  getRoot(): Promise<IServiceResponse<INode[]>>

  updateNode(node: INode): Promise<IServiceResponse<INode>>;

  updateNodes(Nodes: INode[]): Promise<IServiceResponse<{}>>;

  deleteNode(nodeId: string): Promise<IServiceResponse<{}>>;

  deleteNodes(nodeIds: string[]): Promise<IServiceResponse<{}>>;

}