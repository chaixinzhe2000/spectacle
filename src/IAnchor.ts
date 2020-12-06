import { NodeType } from ".";
import IServiceResponse from "./IServiceResponse";

export interface IAnchor {
    nodeId: string
    anchorId: string
	contentList: string[]
	authorList: string[]
	type: NodeType
	createdAt: Date
}

export interface IAnchorGateway {
    createAnchor(anchor: IAnchor): Promise<IServiceResponse<IAnchor>>;
    getAnchor(anchorId: string): Promise<IServiceResponse<IAnchor>>;
	getNodeAnchors(nodeId: string): Promise<IServiceResponse<{[anchorId: string]: IAnchor}>>;
	updateLastAnnotation(anchorId: string, annotation: string, author: string): Promise<IServiceResponse<IAnchor>>;
	addNewAnnotation(anchorId: string, annotation: string, author: string): Promise<IServiceResponse<IAnchor>>;
    deleteAnchor(anchorId: string): Promise<IServiceResponse<{}>>;
    deleteNodeAnchors(nodeId: string): Promise<IServiceResponse<{}>>;
}
