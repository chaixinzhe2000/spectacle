import { IServiceResponse, IAnchor } from "spectacle-interfaces"

// TODO: checked by Chai
export default interface IAnchorDatabaseConnection {
  insertAnchor(anchor: IAnchor): Promise<IServiceResponse<IAnchor>>;
  findAnchor(anchorId: string): Promise<IServiceResponse<IAnchor>>;
  findAnchors(anchorIds: string[]): Promise<IServiceResponse<{[anchorIds: string]: IAnchor}>>;
  findAnchorsByNode(nodeId: string): Promise<IServiceResponse<{[anchorIds: string]: IAnchor}>>;
  deleteAnchor(nodeId: string): Promise<IServiceResponse<{}>>;
  deleteAnchors(nodeIds: string[]): Promise<IServiceResponse<{}>>;
  deleteAnchorsByNode(nodeId: string): Promise<IServiceResponse<{}>>;
  updateLastAnnotation(anchorId: string, content: string, author: string): Promise<IServiceResponse<IAnchor>>;
  addNewAnnotation(anchorId: string, content: string, author: string): Promise<IServiceResponse<IAnchor>>;
}

export interface ITestAnchorDatabaseConnection extends IAnchorDatabaseConnection {
  clearAnchorCollection(): Promise<IServiceResponse<{}>>
  initAnchors(anchors: IAnchor[]): Promise<IServiceResponse<{}>>
}