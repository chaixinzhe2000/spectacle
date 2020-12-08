import { failureServiceResponse, IServiceResponse, successfulServiceResponse, IPDFNode } from "spectacle-interfaces";

// TODO: completed by Chai
export interface IMongoIPDFNode {
	_id: string; // replaces nodeId
	pdfUrl: string
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

export function getMongoNode(node: IPDFNode): IServiceResponse<IMongoIPDFNode> {
	try {
		let mongonode: IMongoIPDFNode = {
			_id: node.nodeId.toLocaleLowerCase(),
			pdfUrl: node.pdfUrl,
			createdAt: new Date()
		}
		return successfulServiceResponse(mongonode)
	} catch {
		return failureServiceResponse("Failed to parse INode into IMongoNode, verify that the INode passed in is valid.")
	}
}

export function tryGetNode(mongoNode: IMongoIPDFNode): IServiceResponse<IPDFNode> {
	if (mongoNode._id !== undefined && typeof mongoNode._id === 'string' && mongoNode._id != ""
		&& mongoNode.pdfUrl !== undefined && typeof mongoNode.pdfUrl === 'string' && isValidHttpUrl(mongoNode.pdfUrl)) {
		return successfulServiceResponse({
			nodeId: mongoNode._id,
			pdfUrl: mongoNode.pdfUrl
		})
	}
	return failureServiceResponse('Invalid node')
}