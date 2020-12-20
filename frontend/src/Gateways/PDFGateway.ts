import { failureServiceResponse, IPDFNode, IPDFNodeGateway, IServiceResponse } from "spectacle-interfaces";
import { get, post, put, remove } from "./request";
import { PDFGatewayEndpoint } from "../GatewayConfig";


let base_endpoint = PDFGatewayEndpoint

if (process.env.REACT_APP_BACKEND_ENV === 'development') {
	base_endpoint = "http://localhost:8081"
}

const servicePath = '/pdf'

const PDFNodeGateway: IPDFNodeGateway = {
	updateNode: async (nodeId: string, pdfUrl: string): Promise<IServiceResponse<IPDFNode>> => {
		const raw = { "pdfUrl": pdfUrl };
		const fullUrl = `${base_endpoint}${servicePath}/${nodeId}`
		try {
			const response: IServiceResponse<IPDFNode> = await put<IServiceResponse<IPDFNode>>(fullUrl, raw);
			return response
		} catch (e) {
			return failureServiceResponse("Failed to update node's pdfUrl. " + e)
		}
	},
	
	createNode: async (node: IPDFNode): Promise<IServiceResponse<IPDFNode>> => {

		const raw = { "data": node };
		const fullUrl = `${base_endpoint}${servicePath}/`

		try {
			const response: IServiceResponse<IPDFNode> = await post<IServiceResponse<IPDFNode>>(fullUrl, raw);
			return response

		} catch (e) {
			return failureServiceResponse("Failed to create node. " + e)
		}
	},

	getNode: async (nodeId: string): Promise<IServiceResponse<IPDFNode>> => {
		try {
			const fullUrl = `${base_endpoint}${servicePath}/${nodeId}`
			const response: IServiceResponse<IPDFNode> = await get<IServiceResponse<IPDFNode>>(fullUrl);
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

export default PDFNodeGateway