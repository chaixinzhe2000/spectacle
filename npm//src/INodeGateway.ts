import INode from "./INode";
import IServiceResponse from "./IServiceResponse";
import IFilePath from "./IFilePath";

export default interface INodeGateway {

  createNode(node: INode): Promise<IServiceResponse<INode>>;

  getNode(nodeId: string): Promise<IServiceResponse<INode>>;

  updateNode(node: INode): Promise<IServiceResponse<INode>>;

  deleteNode(nodeId: string): Promise<IServiceResponse<{}>>;

  getNodeByPath(filePath: IFilePath): Promise<IServiceResponse<INode>>;

  moveNode(moveFrom: IFilePath, moveTo: IFilePath): Promise<IServiceResponse<{}>>;

}