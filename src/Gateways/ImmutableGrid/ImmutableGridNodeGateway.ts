import { failureServiceResponse, IImmutableGridNode, IImmutableGridNodeGateway, IServiceResponse } from "hypertext-interfaces";
import { ImmutableGridGatewayEndpoint } from "../../GatewayConfig";
import { get, post, remove } from "../request";

let base_endpoint = ImmutableGridGatewayEndpoint

if (process.env.REACT_APP_BACKEND_ENV === 'development') {
  base_endpoint = "http://localhost:8081"
}

const servicePath = '/immutable-grid'

const ImmutableGridNodeGateway: IImmutableGridNodeGateway = {

  createNode: async (node: IImmutableGridNode): Promise<IServiceResponse<IImmutableGridNode>> => {

    const raw = {"data": node};
    const fullUrl = `${base_endpoint}${servicePath}/`

    try {
      const response: IServiceResponse<IImmutableGridNode> = await post<IServiceResponse<IImmutableGridNode>>(fullUrl, raw);
      return response

    } catch (e) {
      return failureServiceResponse("Failed to create node. " + e)
    }
  },
    
  getNode: async (nodeId: string): Promise<IServiceResponse<IImmutableGridNode>> => {
    
    try {
      const fullUrl = `${base_endpoint}${servicePath}/${nodeId}`
      const response: IServiceResponse<IImmutableGridNode> = await get<IServiceResponse<IImmutableGridNode>>(fullUrl);
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

export default ImmutableGridNodeGateway
