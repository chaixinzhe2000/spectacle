import { NodeType } from ".";
import IServiceResponse from "./IServiceResponse";

export interface IAnchor {
    nodeId: string
    anchorId: string
    label: string
    type: NodeType
}

export interface IAnchorGateway {
    createAnchor(anchor: IAnchor): Promise<IServiceResponse<IAnchor>>;
    getAnchor(anchorId: string): Promise<IServiceResponse<IAnchor>>;
    getNodeAnchors(nodeId: string): Promise<IServiceResponse<{[anchorId: string]: IAnchor}>>;
    deleteAnchor(anchorId: string): Promise<IServiceResponse<{}>>;
    deleteNodeAnchors(nodeId: string): Promise<IServiceResponse<{}>>;
}
