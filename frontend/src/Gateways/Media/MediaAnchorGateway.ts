import { failureServiceResponse, IMediaAnchorGateway, IMediaAnchor, IServiceResponse } from "spectacle-interfaces";
import { get, post, remove } from "../request";
import { MediaGatewayEndpoint } from "../../GatewayConfig";

let base_endpoint = MediaGatewayEndpoint

if (process.env.REACT_APP_BACKEND_ENV === 'development') {
	base_endpoint = "http://localhost:8081"
}

const servicePath = '/media-anchor'

const MediaAnchorGateway: IMediaAnchorGateway = {

	createAnchor: async (anchor: IMediaAnchor): Promise<IServiceResponse<IMediaAnchor>> => {
		const raw = { "data": anchor };
		const fullUrl = `${base_endpoint}${servicePath}/`
		try {
			const response: IServiceResponse<IMediaAnchor> = await post<IServiceResponse<IMediaAnchor>>(fullUrl, raw);
			return response
		} catch (e) {
			return failureServiceResponse("Failed to create anchor. " + e)
		}
	},

	getAnchor: async (anchorId: string): Promise<IServiceResponse<IMediaAnchor>> => {
		try {
			const fullUrl = `${base_endpoint}${servicePath}/${anchorId}`
			const response: IServiceResponse<IMediaAnchor> = await get<IServiceResponse<IMediaAnchor>>(fullUrl);
			return response
		} catch (e) {
			return failureServiceResponse('Failed to call getAnchor endpoint.')
		}
	},

	getAnchors: async (anchorIds: string[]): Promise<IServiceResponse<{ [anchorId: string]: IMediaAnchor }>> => {
		try {
			const fullUrl = `${base_endpoint}${servicePath}/list/${anchorIds.join(',')}`
			const response: IServiceResponse<{ [anchorId: string]: IMediaAnchor }> = await get<IServiceResponse<{ [anchorId: string]: IMediaAnchor }>>(fullUrl);
			return response
		} catch (e) {
			return failureServiceResponse('Failed to call getAnchor endpoint.')
		}
	},

	deleteAnchor: async (anchorId: string): Promise<IServiceResponse<{}>> => {
		try {
			const fullUrl = `${base_endpoint}${servicePath}/${anchorId}`
			const response: IServiceResponse<{}> = await remove<IServiceResponse<{}>>(fullUrl);
			return response

		} catch (e) {
			return failureServiceResponse('Failed to call deleteAnchor endpoint.')
		}
	},

	deleteAnchors: async (anchorIds: string[]): Promise<IServiceResponse<{}>> => {
		try {
			const fullUrl = `${base_endpoint}${servicePath}/list/${anchorIds.join(',')}`
			const response: IServiceResponse<{}> = await remove<IServiceResponse<{}>>(fullUrl);
			return response

		} catch (e) {
			return failureServiceResponse('Failed to call deleteAnchor endpoint.')
		}
	}
}

export default MediaAnchorGateway