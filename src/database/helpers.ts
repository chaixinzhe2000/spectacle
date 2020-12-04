import { failureServiceResponse, IServiceResponse, successfulServiceResponse, IAnchor, NodeType, isNodeType } from "spectacle-interfaces"

// TODO: completed by Chai
export interface IMongoAnchor {
    _id: string // replaces nodeId
	nodeId: string,
	type: NodeType,
	annotation: string,
    createdAt: Date
}
  
export function getMongoAnchor(anchor: IAnchor): IServiceResponse<IMongoAnchor> {
    try {
        let mongonode: IMongoAnchor = {
            _id: anchor.anchorId.toLocaleLowerCase(),
			nodeId: anchor.nodeId,
			type: anchor.type,
			annotation: anchor.content,
            createdAt: new Date()
		}
        if (tryGetAnchor(mongonode).success)
            return successfulServiceResponse(mongonode)
        else
            return failureServiceResponse("Failed to parse IAnchor into IMongoAnchor, verify that the IAnchor passed in is valid.")

    } catch {
        return failureServiceResponse("Failed to parse IAnchor into IMongoAnchor, verify that the IAnchor passed in is valid.")
    }
}

export function tryGetAnchor(mongoAnchor: IMongoAnchor): IServiceResponse<IAnchor> {
    if (mongoAnchor.nodeId !== undefined && typeof mongoAnchor.nodeId === 'string' && mongoAnchor.nodeId !== ''
	&& mongoAnchor._id !== undefined && typeof mongoAnchor._id === 'string' && mongoAnchor._id !== ''
	&& mongoAnchor.type !== undefined && isNodeType(mongoAnchor.type) === true
	&& mongoAnchor.annotation !== undefined && typeof mongoAnchor.annotation === 'string' && mongoAnchor.annotation !== ''
    && mongoAnchor.createdAt !== undefined && mongoAnchor.createdAt !== null && mongoAnchor.createdAt instanceof Date) {
		let anchor: IAnchor = {
			nodeId: mongoAnchor.nodeId,
			anchorId: mongoAnchor._id,
			type: mongoAnchor.type,
			content: mongoAnchor.annotation,
			createdAt: mongoAnchor.createdAt
		}
		return successfulServiceResponse(anchor)
	}
    return failureServiceResponse('Invalid node')
}