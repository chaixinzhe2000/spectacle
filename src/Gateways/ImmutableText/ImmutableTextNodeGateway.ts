import { failureServiceResponse, IImmutableTextNode, IImmutableTextNodeGateway, IServiceResponse } from "hypertext-interfaces";
import { get, post, remove } from "../request";

let base_endpoint = "https://stormy-hamlet-90499.herokuapp.com"

if (process.env.REACT_APP_BACKEND_ENV === 'development') {
  base_endpoint = "http://localhost:8081"
}

const servicePath = '/immutable-text'

const ImmutableTextNodeGateway: IImmutableTextNodeGateway = {

  createNode: async (node: IImmutableTextNode): Promise<IServiceResponse<IImmutableTextNode>> => {

    const raw = {"data": node};
    const fullUrl = `${base_endpoint}${servicePath}/`

    try {
      const response: IServiceResponse<IImmutableTextNode> = await post<IServiceResponse<IImmutableTextNode>>(fullUrl, raw);
      return response

    } catch (e) {
      return failureServiceResponse("Failed to create node. " + e)
    }
  },
    
  getNode: async (nodeId: string): Promise<IServiceResponse<IImmutableTextNode>> => {
    try {
      const fullUrl = `${base_endpoint}${servicePath}/${nodeId}`
      const response: IServiceResponse<IImmutableTextNode> = await get<IServiceResponse<IImmutableTextNode>>(fullUrl);
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

export default ImmutableTextNodeGateway
