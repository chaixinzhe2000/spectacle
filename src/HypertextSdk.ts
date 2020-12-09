import { Anchor } from "antd";
import { NodeTracing } from "inspector";
import { failureServiceResponse, IAnchor, IImmutableTextAnchor, IMediaAnchor, INode, IServiceResponse, NodeType, successfulServiceResponse } from "spectacle-interfaces";
import AnchorGateway from "./Gateways/AnchorGateway";
import ImmutableTextAnchorGateway from "./Gateways/ImmutableText/ImmutableTextAnchorGateway";
import ImmutableTextNodeGateway from "./Gateways/ImmutableText/ImmutableTextNodeGateway";
import LinkGateway from "./Gateways/LinkGateway";
import MediaAnchorGateway from "./Gateways/Media/MediaAnchorGateway";
import NodeGateway from "./Gateways/NodeGateway";
import { generateAnchorId } from "./NodeManager/helpers/generateNodeId";

interface IHypertextSdk {
	// creating two anchors at the same time with different functionality
	createImmutableTextAnchor(data: {
		anchor: IAnchor,
		immutableTextAnchor: IImmutableTextAnchor
	})
	createMediaAnchor(data: {
		anchor: IAnchor,
		mediaAnchor: IMediaAnchor
	})
	deleteNode: (node: INode) => Promise<IServiceResponse<{}>>
	deleteAnchor: (anchorId: string) => Promise<IServiceResponse<{}>>
	addAnchorFollowUp: (data: {
		anchorId: string, content: string, author: string
	}) => Promise<IServiceResponse<{}>>
	updateLastAnnotation: (data: {
		anchorId: string, content: string, author: string
	}) => Promise<IServiceResponse<{}>>
}

// TODO: define the type to be IHypertextSdk later
const HypertextSdk: IHypertextSdk = {
	deleteNode: async (node: INode): Promise<IServiceResponse<{}>> => {
		const deleteNodeResponse = await NodeGateway.deleteNode(node.nodeId)
		if (!deleteNodeResponse.success) {
			return deleteNodeResponse
		}
		const nodeIds = getNodeIds(node)
		const responses = await Promise.all(nodeIds.map(nid => deleteRelatedNodeData(nid)))

		let errMsg = ''
		responses.forEach(sr => errMsg += sr.message)

		if (errMsg !== '') {
			return failureServiceResponse(errMsg)
		}
		return successfulServiceResponse({})

	},

	deleteAnchor: async (anchorId: string): Promise<IServiceResponse<{}>> => {
		let errMsg = ''
		const nodeType: NodeType = await (await AnchorGateway.getAnchor(anchorId)).payload.type
		const deleteAnchorsResponse = await AnchorGateway.deleteAnchor(anchorId)
		if (!deleteAnchorsResponse.success) {
			errMsg += deleteAnchorsResponse.message
		}
		if (nodeType === 'immutable-text') {
			const deleteImmutableAnchorsResponse = await ImmutableTextAnchorGateway.deleteAnchor(anchorId)
			if (!deleteImmutableAnchorsResponse.success) {
				errMsg += deleteImmutableAnchorsResponse.message
			}
		} else if (nodeType === 'media') {
			const deleteMediaAnchorsResponse = await MediaAnchorGateway.deleteAnchor(anchorId)
			if (!deleteMediaAnchorsResponse.success) {
				errMsg += deleteMediaAnchorsResponse.message
			}
		}
		const deleteLinkResponse = await LinkGateway.deleteAnchorLinks(anchorId)
		if (!deleteLinkResponse.success) {
			errMsg += deleteLinkResponse.message
		}
		if (errMsg !== '') {
			return failureServiceResponse(errMsg)
		}
		return successfulServiceResponse({})
	},

	createImmutableTextAnchor: async (data: { anchor: IAnchor, immutableTextAnchor: IImmutableTextAnchor }):
		Promise<IServiceResponse<{ anchor: IAnchor, immutableTextAnchor: IImmutableTextAnchor }>> => {
		const createAnchor = await AnchorGateway.createAnchor(data.anchor)
		if (createAnchor.success) {
			const createImmutableAnchor = await ImmutableTextAnchorGateway.createAnchor(data.immutableTextAnchor)
			if (createImmutableAnchor.success) {
				return successfulServiceResponse({
					anchor: createAnchor.payload,
					immutableTextAnchor: createImmutableAnchor.payload
				})
			} else {
				return failureServiceResponse(createImmutableAnchor.message)
			}
		} else {
			return failureServiceResponse(createAnchor.message)
		}
	},

	createMediaAnchor: async (data: { anchor: IAnchor, mediaAnchor: IMediaAnchor }):
		Promise<IServiceResponse<{ anchor: IAnchor, mediaAnchor: IMediaAnchor }>> => {
		const createAnchor = await AnchorGateway.createAnchor(data.anchor)
		if (createAnchor.success) {
			const createMediaAnchor = await MediaAnchorGateway.createAnchor(data.mediaAnchor)
			if (createMediaAnchor.success) {
				return successfulServiceResponse({
					anchor: createAnchor.payload,
					mediaAnchor: createMediaAnchor.payload
				})
			} else {
				return failureServiceResponse(createMediaAnchor.message)
			}
		} else {
			return failureServiceResponse(createAnchor.message)
		}
	},

	addAnchorFollowUp: async (data: { anchorId: string, content: string, author: string }): Promise<IServiceResponse<{}>> => {
		const addFollowUp = await AnchorGateway.addNewAnnotation(data.anchorId, data.content, data.author)
		if (addFollowUp.success) {
			return successfulServiceResponse({})
		}
		return failureServiceResponse("Failed to add follow up annotation")
	},

	updateLastAnnotation: async (data: { anchorId: string, content: string, author: string }): Promise<IServiceResponse<{}>> => {
		const updateLastAnnotation = await AnchorGateway.updateLastAnnotation(data.anchorId, data.content, data.author)
		if (updateLastAnnotation.success) {
			return successfulServiceResponse({})
		}
		return failureServiceResponse("Failed to update last annotation")
	}
}

function getNodeIds(node: INode): string[] {
	let childrenIds = []

	node.children.forEach(child => {
		childrenIds = childrenIds.concat(getNodeIds(child))
	})

	return [node.nodeId].concat(childrenIds)
}

async function deleteRelatedNodeData(nodeId: string): Promise<IServiceResponse<{}>> {
	let errMsg = ''

	const deleteImmutableNodeResponse = await ImmutableTextNodeGateway.deleteNode(nodeId)
	if (!deleteImmutableNodeResponse.success) {
		errMsg += deleteImmutableNodeResponse.message
	}

	const getNodeAnchorsResponse = await AnchorGateway.getNodeAnchors(nodeId)

	const deleteAnchorsResponse = await AnchorGateway.deleteNodeAnchors(nodeId)
	if (!deleteAnchorsResponse.success) {
		errMsg += deleteAnchorsResponse.message
	}

	if (getNodeAnchorsResponse.success) {
		const deleteImmutableAnchorsResponse = await ImmutableTextAnchorGateway.deleteAnchors(Object.keys(getNodeAnchorsResponse.payload))
		if (!deleteImmutableAnchorsResponse.success) {
			errMsg += deleteImmutableAnchorsResponse.message
		}
	}

	const deleteLinkResponse = await LinkGateway.deleteNodeLinks(nodeId)
	if (!deleteLinkResponse.success) {
		errMsg += deleteLinkResponse.message
	}

	if (errMsg !== '') {
		return failureServiceResponse(errMsg)
	}

	return successfulServiceResponse({})
}

export default HypertextSdk