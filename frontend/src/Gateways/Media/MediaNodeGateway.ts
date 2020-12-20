import { failureServiceResponse, IMediaNode, IMediaNodeGateway, IServiceResponse } from "spectacle-interfaces";
import { get, post, put, remove } from "../request";
import { MediaGatewayEndpoint } from "../../GatewayConfig";


let base_endpoint = MediaGatewayEndpoint

if (process.env.REACT_APP_BACKEND_ENV === 'development') {
	base_endpoint = "http://localhost:8081"
}

const servicePath = '/media'

const MediaNodeGateway: IMediaNodeGateway = {
	updateNode: async (nodeId: string, mediaUrl: string): Promise<IServiceResponse<IMediaNode>> => {
		const raw = { "mediaUrl": mediaUrl };
		const fullUrl = `${base_endpoint}${servicePath}/${nodeId}`
		try {
			const response: IServiceResponse<IMediaNode> = await put<IServiceResponse<IMediaNode>>(fullUrl, raw);
			return response
		} catch (e) {
			return failureServiceResponse("Failed to update node's mediaUrl. " + e)
		}
	},
	
	createNode: async (node: IMediaNode): Promise<IServiceResponse<IMediaNode>> => {

		const raw = { "data": node };
		const fullUrl = `${base_endpoint}${servicePath}/`

		try {
			const response: IServiceResponse<IMediaNode> = await post<IServiceResponse<IMediaNode>>(fullUrl, raw);
			return response

		} catch (e) {
			return failureServiceResponse("Failed to create node. " + e)
		}
	},

	getNode: async (nodeId: string): Promise<IServiceResponse<IMediaNode>> => {
		try {
			const fullUrl = `${base_endpoint}${servicePath}/${nodeId}`
			const response: IServiceResponse<IMediaNode> = await get<IServiceResponse<IMediaNode>>(fullUrl);
			return response
		} catch (e) {
			return failureServiceResponse('Failed to call getNode endpoint.')
		}
	},

	deleteNode: async (nodeId: string): Promise<IServiceResponse<{}>> => {
		try {
			const fullUrl = `${base_endpoint}${servicePath}/${nodeId}`
			const response: IServiceResponse<{}> = await remove<IServiceResponse<{}>>(fullUrl);
			return response

		} catch (e) {
			return failureServiceResponse('Failed to call deleteNode endpoint.')
		}
	},

	deleteNodes: async (nodeIds: string[]): Promise<IServiceResponse<{}>> => {
		try {
			const fullUrl = `${base_endpoint}${servicePath}/list/${nodeIds.join(',')}`
			const response: IServiceResponse<{}> = await remove<IServiceResponse<{}>>(fullUrl);
			return response

		} catch (e) {
			return failureServiceResponse('Failed to call deleteNode endpoint.')
		}
	}
}

export default MediaNodeGateway
