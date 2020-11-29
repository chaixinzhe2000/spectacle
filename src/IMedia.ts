import IServiceResponse from "./IServiceResponse";

export interface IMediaNode {
    nodeId: string
    mediaUrl: string
}

export interface IMediaNodeGateway {
    createNode(node: IMediaNodeGateway): Promise<IServiceResponse<IMediaNodeGateway>>;
    getNode(nodeId: string): Promise<IServiceResponse<IMediaNodeGateway>>;
    deleteNode(nodeId: string): Promise<IServiceResponse<{}>>;
    deleteNodes(nodeIds: string[]): Promise<IServiceResponse<{}>>;
}

export interface IMediaAnchor {
    anchorId: string
    mediaTimeStamp: number
}

export interface IMediaAnchorGateway {
    createAnchor(anchor: IMediaAnchorGateway): Promise<IServiceResponse<IMediaAnchorGateway>>;
    getAnchor(anchorId: string): Promise<IServiceResponse<IMediaAnchorGateway>>;
    getAnchors(anchorIds: string[]): Promise<IServiceResponse<{[anchorId: string]: IMediaAnchorGateway}>>;
	// TODO: addtional feature - updateMediaTimeStamp
	deleteAnchor(anchorId: string): Promise<IServiceResponse<{}>>;
    deleteAnchors(anchorIds: string[]): Promise<IServiceResponse<{}>>;
}
