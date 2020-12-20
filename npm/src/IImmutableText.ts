import IServiceResponse from "./IServiceResponse";

export interface IImmutableTextNode {
    nodeId: string
    text: string
}

export interface IImmutableTextNodeGateway {
    createNode(node: IImmutableTextNode): Promise<IServiceResponse<IImmutableTextNode>>;
    getNode(nodeId: string): Promise<IServiceResponse<IImmutableTextNode>>;
    deleteNode(nodeId: string): Promise<IServiceResponse<{}>>;
    deleteNodes(nodeIds: string[]): Promise<IServiceResponse<{}>>;
}

export interface IImmutableTextAnchor {
    anchorId: string
    start: number
    end: number
}

export interface IImmutableTextAnchorGateway {
    createAnchor(anchor: IImmutableTextAnchor): Promise<IServiceResponse<IImmutableTextAnchor>>;
    getAnchor(anchorId: string): Promise<IServiceResponse<IImmutableTextAnchor>>;
    getAnchors(anchorIds: string[]): Promise<IServiceResponse<{[anchorId: string]: IImmutableTextAnchor}>>;
    deleteAnchor(anchorId: string): Promise<IServiceResponse<{}>>;
    deleteAnchors(anchorIds: string[]): Promise<IServiceResponse<{}>>;
}
