import { failureServiceResponse, IServiceResponse, successfulServiceResponse, IMediaNode } from "spectacle-interfaces";

// TODO: completed by Chai
export interface IMongoIMediaNode {
	_id: string; // replaces nodeId
	mediaUrl: string
	createdAt?: Date
}

function isValidHttpUrl(urlString: string) {
	let url;
	try {
		url = new URL(urlString);
	} catch (_) {
		return false;
	}
	return url.protocol === "http:" || url.protocol === "https:";
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
		&& mongoNode.mediaUrl !== undefined && typeof mongoNode.mediaUrl === 'string' && isValidHttpUrl(mongoNode.mediaUrl)) {
		return successfulServiceResponse({
			nodeId: mongoNode._id,
			mediaUrl: mongoNode.mediaUrl
		})
	}
	return failureServiceResponse('Invalid node')
}