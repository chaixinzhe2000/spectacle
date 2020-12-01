import { failureServiceResponse, IServiceResponse, successfulServiceResponse, IMediaNode } from "spectacle-interfaces";

// TODO: completed by Chai
export interface IMongoIMediaNode {
	_id: string; // replaces nodeId
	mediaUrl: string
	createdAt?: Date
}

export function getMongoNode(node: IMediaNode): IServiceResponse<IMongoIMediaNode> {
	try {
		let mongonode: IMongoIMediaNode = {
			_id: node.nodeId.toLocaleLowerCase(),
			mediaUrl: node.mediaUrl,
			createdAt: new Date()
		}
		return successfulServiceResponse(mongonode)
	} catch {
		return failureServiceResponse("Failed to parse INode into IMongoNode, verify that the INode passed in is valid.")
	}
}

export function tryGetNode(mongoNode: IMongoIMediaNode): IServiceResponse<IMediaNode> {
    if (mongoNode.mediaUrl !== undefined && typeof mongoNode.mediaUrl === 'string') {
		return successfulServiceResponse({
            nodeId: mongoNode._id,
            mediaUrl: mongoNode.mediaUrl
        })
	}
    return failureServiceResponse('Invalid node')
}