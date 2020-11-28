import { failureServiceResponse, IImmutableGridAnchor, IImmutableGridAnchorGateway, IServiceResponse } from "hypertext-interfaces";
import { ImmutableGridGatewayEndpoint } from "../../GatewayConfig";
import { get, post, remove } from "../request";

let base_endpoint = ImmutableGridGatewayEndpoint

if (process.env.REACT_APP_BACKEND_ENV === 'development') {
  base_endpoint = "http://localhost:8081"
}

const servicePath = '/immutable-grid-anchor'

const ImmutableGridAnchorGateway: IImmutableGridAnchorGateway = {

  createAnchor: async (anchor: IImmutableGridAnchor): Promise<IServiceResponse<IImmutableGridAnchor>> => {

    const raw = {"data": anchor};
    const fullUrl = `${base_endpoint}${servicePath}/`

    try {
      const response: IServiceResponse<IImmutableGridAnchor> = await post<IServiceResponse<IImmutableGridAnchor>>(fullUrl, raw);
      return response

    } catch (e) {
      return failureServiceResponse("Failed to create anchor. " + e)
    }
  },
    
  getAnchor: async (anchorId: string): Promise<IServiceResponse<IImmutableGridAnchor>> => {
    
    try {
      const fullUrl = `${base_endpoint}${servicePath}/${anchorId}`
      const response: IServiceResponse<IImmutableGridAnchor> = await get<IServiceResponse<IImmutableGridAnchor>>(fullUrl);
      return response
    } catch (e) {
      return failureServiceResponse('Failed to call getAnchor endpoint.')
    }  
  },

  getAnchors: async (anchorIds: string[]): Promise<IServiceResponse<{[anchorId: string]: IImmutableGridAnchor}>> => {
    
    try {
      const fullUrl = `${base_endpoint}${servicePath}/list/${anchorIds.join(',')}`
      const response: IServiceResponse<{[anchorId: string]: IImmutableGridAnchor}> = await get<IServiceResponse<{[anchorId: string]: IImmutableGridAnchor}>>(fullUrl);
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

export default ImmutableGridAnchorGateway