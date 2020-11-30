import { IMediaAnchor, IServiceResponse } from "apposition-interfaces"

// TODO: completed by Chai
export default interface IMediaAnchorDatabaseConnection {
	insertAnchor(anchor: IMediaAnchor): Promise<IServiceResponse<IMediaAnchor>>;
	findAnchor(anchorId: string): Promise<IServiceResponse<IMediaAnchor>>;
	findAnchors(anchorIds: string[]): Promise<IServiceResponse<{[anchorId: string] : IMediaAnchor}>>;
	deleteAnchor(anchorId: string): Promise<IServiceResponse<{}>>;
	deleteAnchors(anchorIds: string[]): Promise<IServiceResponse<{}>>;
}

export interface ITestMediaAnchorDatabaseConnection extends IMediaAnchorDatabaseConnection {
  clearAnchorCollection(): Promise<IServiceResponse<{}>>
  initAnchors(anchors: IMediaAnchor[]): Promise<IServiceResponse<{}>>
}