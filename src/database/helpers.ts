import { response } from "express"
import { failureServiceResponse, IServiceResponse, successfulServiceResponse, IAnchor, NodeType, isNodeType } from "spectacle-interfaces"

// TODO: completed by Chai
export interface IMongoAnchor {
    _id: string // replaces nodeId
	nodeId: string,
	type: NodeType,
	annotationList: string[],
	authorList: string[],
    createdAt: Date
}
  
export function getMongoAnchor(anchor: IAnchor): IServiceResponse<IMongoAnchor> {	
    try {
        let mongonode: IMongoAnchor = {
            _id: anchor.anchorId.toLocaleLowerCase(),
			nodeId: anchor.nodeId,
			type: anchor.type,
			annotationList: anchor.contentList,
			authorList: anchor.authorList,
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

function validateField(array: string[]): boolean {
	if (array == undefined || array == null || !(array.length > 0)) {
		return false
	}
	let validFlag = true
	array.forEach((listItem) => {
		if (listItem == undefined || typeof listItem != 'string' || listItem == '') {
			validFlag = false
		}
	})
	return validFlag
}

export function tryGetAnchor(mongoAnchor: IMongoAnchor): IServiceResponse<IAnchor> {
    if (mongoAnchor.nodeId !== undefined && typeof mongoAnchor.nodeId === 'string' && mongoAnchor.nodeId !== ''
	&& mongoAnchor._id !== undefined && typeof mongoAnchor._id === 'string' && mongoAnchor._id !== ''
	&& mongoAnchor.type !== undefined && isNodeType(mongoAnchor.type) === true
	&& validateField(mongoAnchor.annotationList) && validateField(mongoAnchor.authorList)
	&& mongoAnchor.authorList.length === mongoAnchor.annotationList.length
    && mongoAnchor.createdAt !== undefined && mongoAnchor.createdAt !== null && mongoAnchor.createdAt instanceof Date) {
		let anchor: IAnchor = {
			nodeId: mongoAnchor.nodeId,
			anchorId: mongoAnchor._id,
			type: mongoAnchor.type,
			contentList: mongoAnchor.annotationList,
			authorList: mongoAnchor.authorList,
			createdAt: mongoAnchor.createdAt
		}
		return successfulServiceResponse(anchor)
	}
    return failureServiceResponse('Invalid node')
}