import { failureServiceResponse, IServiceResponse, successfulServiceResponse, IMediaNode } from "spectacle-interfaces";

// TODO: completed by Chai
export interface IMongoIMediaNode {
	_id: string; // replaces nodeId
	mediaUrl: string
	createdAt?: Date
}

function isURL(url: string) {
	var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
		'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
		'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
		'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
		'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
		'(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
	return pattern.test(url);
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
	if (mongoNode._id !== undefined && typeof mongoNode._id === 'string' && mongoNode._id != ""
	&& mongoNode.mediaUrl !== undefined && typeof mongoNode.mediaUrl === 'string' && isURL(mongoNode.mediaUrl)) {
		return successfulServiceResponse({
            nodeId: mongoNode._id,
            mediaUrl: mongoNode.mediaUrl
        })
	}
    return failureServiceResponse('Invalid node')
}