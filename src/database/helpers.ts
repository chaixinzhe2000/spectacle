import { failureServiceResponse, IServiceResponse, successfulServiceResponse, IAnchor } from "hypertext-interfaces"

export interface IMongoAnchor {
    _id: string // replaces nodeId
    nodeId: string,
    label: string
    createdAt?: Date
}
  
export function getMongoAnchor(anchor: IAnchor): IServiceResponse<IMongoAnchor> {
    try {
        let mongonode: IMongoAnchor = {
            _id: anchor.anchorId.toLocaleLowerCase(),
            nodeId: anchor.nodeId,
            label: anchor.label,
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
    && mongoAnchor.label !== undefined && typeof mongoAnchor.label === 'string')
        return successfulServiceResponse({
            nodeId: mongoAnchor.nodeId,
            anchorId: mongoAnchor._id,
            label: mongoAnchor.label
        })

    return failureServiceResponse('Invalid node')
}