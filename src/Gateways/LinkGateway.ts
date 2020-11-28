import { failureServiceResponse, ILink, ILinkGateway, IServiceResponse } from "hypertext-interfaces";
import { get, post, remove } from "./request";
import { LinkGatewayEndpoint } from "../GatewayConfig";

let base_endpoint = LinkGatewayEndpoint

if (process.env.REACT_APP_BACKEND_ENV === 'development') {
  base_endpoint = "http://localhost:8081"
}

const servicePath = '/link'

const LinkGateway: ILinkGateway = {

  createLink: async (node: ILink): Promise<IServiceResponse<ILink>> => {

    const raw = {"data": node};
    const fullUrl = `${base_endpoint}${servicePath}/`

    try {
      const response: IServiceResponse<ILink> = await post<IServiceResponse<ILink>>(fullUrl, raw);
      return response

    } catch (e) {
      return failureServiceResponse("Failed to create node. " + e)
    }
  },
    
  getLink: async (anchorId: string): Promise<IServiceResponse<ILink>> => {
    
    try {
      const fullUrl = `${base_endpoint}${servicePath}/${anchorId}`
      const response: IServiceResponse<ILink> = await get<IServiceResponse<ILink>>(fullUrl);
      return response
    } catch (e) {
      return failureServiceResponse('Failed to call getLink endpoint.')
    }  
  },

  getLinks: async (linkIds: string[]): Promise<IServiceResponse<{ [linkId: string]: ILink }>> => {
    
    try {
      // const fullUrl = `${base_endpoint}${servicePath}/${anchorId}`
      // const response: IServiceResponse<ILink> = await get<IServiceResponse<{ [linkId: string]: ILink }>>(fullUrl);
      // return response
    } catch (e) {
      return failureServiceResponse('Failed to call getLink endpoint.')
    }  
  },

  getAnchorLinks: async (anchorId: string): Promise<IServiceResponse<{[anchorId: string] : ILink}>> => {
    
    try {
      const fullUrl = `${base_endpoint}${servicePath}/anchor/${anchorId}`
      const response: IServiceResponse<{[anchorId: string] : ILink}> = await get<IServiceResponse<{[anchorId: string] : ILink}>>(fullUrl);
      return response
    } catch (e) {
      return failureServiceResponse('Failed to call getAnchorLink endpoint.')
    }  
  },

  getNodeLinks: async (nodeId: string): Promise<IServiceResponse<{[anchorId: string] : ILink}>> => {
    
    try {
      const fullUrl = `${base_endpoint}${servicePath}/node/${nodeId}`
      const response: IServiceResponse<{[anchorId: string] : ILink}> = await get<IServiceResponse<{[anchorId: string] : ILink}>>(fullUrl);
      return response
    } catch (e) {
      return failureServiceResponse('Failed to call getNodeLink endpoint.')
    }  
  },
    
  deleteLink: async (linkId: string): Promise<IServiceResponse<{}>> => {    
    try {
      const fullUrl = `${base_endpoint}${servicePath}/${linkId}`
      const response: IServiceResponse<{}> = await remove<IServiceResponse<{}>>(fullUrl);
      return response

    } catch (e) {
      return failureServiceResponse('Failed to call deleteLink endpoint.')
    }
  },

  deleteLinks: async (linkIds: string[]): Promise<IServiceResponse<{}>> => {
  
    try {
      const fullUrl = `${base_endpoint}${servicePath}/list/${linkIds.join(',')}`
      const response: IServiceResponse<number> = await remove<IServiceResponse<number>>(fullUrl);
      return response
    } catch (e) {
      return failureServiceResponse('Failed to call getLink endpoint.')
    }  

  },

  deleteAnchorLinks: async (anchorId: string): Promise<IServiceResponse<{}>> => {
  
    try {
      const fullUrl = `${base_endpoint}${servicePath}/anchor/${anchorId}`
      const response: IServiceResponse<{}> = await remove<IServiceResponse<{}>>(fullUrl);
      return response
    } catch (e) {
      return failureServiceResponse('Failed to call getLink endpoint.')
    }  


  },

  deleteNodeLinks: async (nodeId: string): Promise<IServiceResponse<{}>> => {
  
    try {
      const fullUrl = `${base_endpoint}${servicePath}/node/${nodeId}`
      const response: IServiceResponse<{}> = await remove<IServiceResponse<{}>>(fullUrl);
      return response
    } catch (e) {
      return failureServiceResponse('Failed to call deleteNodeLinks endpoint, make sure you have properly deployed the link service to production.')
    }  
  },
}

export default LinkGateway
