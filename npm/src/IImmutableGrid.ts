import { IServiceResponse } from ".";

export interface IImmutableGridNode {
    nodeId: string
    columns: { key: string, name: string }[]
    rows: { [key: string]: string }[]
}

export interface IImmutableGridNodeGateway {
    createNode(node: IImmutableGridNode): Promise<IServiceResponse<IImmutableGridNode>>;
    getNode(nodeId: string): Promise<IServiceResponse<IImmutableGridNode>>;
    deleteNode(nodeId: string): Promise<IServiceResponse<{}>>;
    deleteNodes(nodeIds: string[]): Promise<IServiceResponse<{}>>;
}

export interface IImmutableGridAnchor {
    anchorId: string
    topLeftCell: { row: number, columm: number }
    bottomRightCell: { row: number, columm: number }
}

export interface IImmutableGridAnchorGateway {
    createAnchor(anchor: IImmutableGridAnchor): Promise<IServiceResponse<IImmutableGridAnchor>>;
    getAnchor(anchorId: string): Promise<IServiceResponse<IImmutableGridAnchor>>;
    getAnchors(anchorIds: string[]): Promise<IServiceResponse<{[anchorId: string]: IImmutableGridAnchor}>>;
    deleteAnchor(anchorId: string): Promise<IServiceResponse<{}>>;
    deleteAnchors(anchorIds: string[]): Promise<IServiceResponse<{}>>;
}