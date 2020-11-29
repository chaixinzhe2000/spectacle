import { NodeType } from ".";
import IServiceResponse from "./IServiceResponse";

export interface IAnchor {
    nodeId: string
    anchorId: string
    content: string // student edit
	type: NodeType
	createdTimeStamp: Date
}

export interface IAnchorGateway {
    createAnchor(anchor: IAnchor): Promise<IServiceResponse<IAnchor>>;
    getAnchor(anchorId: string): Promise<IServiceResponse<IAnchor>>;
	getNodeAnchors(nodeId: string): Promise<IServiceResponse<{[anchorId: string]: IAnchor}>>;
	updateAnchorContent(anchorId: string): Promise<IServiceResponse<IAnchor>>;
	updateCreatedTimeStamp(anchorId: string): Promise<IServiceResponse<IAnchor>>;
    deleteAnchor(anchorId: string): Promise<IServiceResponse<{}>>;
    deleteNodeAnchors(nodeId: string): Promise<IServiceResponse<{}>>;
}
