import IServiceResponse from "./IServiceResponse";

export interface IMediaNode {
    nodeId: string
    mediaUrl: string
}

export interface IMediaNodeGateway {
    createNode(node: IMediaNode): Promise<IServiceResponse<IMediaNode>>;
	getNode(nodeId: string): Promise<IServiceResponse<IMediaNode>>;
	updateNode(nodeId: string, mediaUrl: string): Promise<IServiceResponse<IMediaNode>>;
    deleteNode(nodeId: string): Promise<IServiceResponse<{}>>;
    deleteNodes(nodeIds: string[]): Promise<IServiceResponse<{}>>;
}

export interface IMediaAnchor {
    anchorId: string
    mediaTimeStamp: number
}

export interface IMediaAnchorGateway {
    createAnchor(anchor: IMediaAnchor): Promise<IServiceResponse<IMediaAnchor>>;
    getAnchor(anchorId: string): Promise<IServiceResponse<IMediaAnchor>>;
	getAnchors(anchorIds: string[]): Promise<IServiceResponse<{[anchorId: string]: IMediaAnchor}>>;
	deleteAnchor(anchorId: string): Promise<IServiceResponse<{}>>;
    deleteAnchors(anchorIds: string[]): Promise<IServiceResponse<{}>>;
}
