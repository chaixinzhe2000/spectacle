import Axios, { AxiosResponse } from "axios"
import { INodeGateway, IFilePath, IServiceResponse, INode, failureServiceResponse } from "hypertext-interfaces"
import { NodeGatewayEndpoint } from "../GatewayConfig"
import { get, post, put, remove } from "./request"

let base_endpoint = NodeGatewayEndpoint

if (process.env.REACT_APP_BACKEND_ENV === 'development') {
  base_endpoint = "http://localhost:8081"
}

const servicePath = '/node'

const NodeGateway: INodeGateway = {

  createNode: async (node: INode): Promise<IServiceResponse<INode>> => {

    const raw = {"data": node};
    const fullUrl = `${base_endpoint}${servicePath}/`

    try {
      const response: IServiceResponse<INode> = await post<IServiceResponse<INode>>(fullUrl, raw);
      return response

    } catch (e) {
      return failureServiceResponse("Failed to create node. " + e)
    }
  },
    
  getNode: async (nodeId: string): Promise<IServiceResponse<INode>> => {
    
    try {
      const fullUrl = `${base_endpoint}${servicePath}/${nodeId}`
      const response: IServiceResponse<INode> = await get<IServiceResponse<INode>>(fullUrl);
      return response
    } catch (e) {
      return failureServiceResponse('Failed to call getNode endpoint.')
    }  
  },
    
  updateNode: async (node: INode): Promise<IServiceResponse<INode>> => {

    const raw = { "data": node};

    const fullUrl = `${base_endpoint}${servicePath}`

    try {
      const response: IServiceResponse<INode> = await put<IServiceResponse<INode>>(fullUrl, raw);
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

  getNodeByPath: async (filePath: IFilePath): Promise<IServiceResponse<INode>> => {

    const raw = { "data": filePath.filePath };
    const fullUrl = `${base_endpoint}${servicePath}/path`

    try {
      const response: IServiceResponse<INode> = await post<IServiceResponse<INode>>(fullUrl, raw);
      return response

    } catch {
      return failureServiceResponse("Failed to get node by path.")
    }
  },

  moveNode: async (newLocation: IFilePath, oldLocation: IFilePath): Promise<IServiceResponse<INode>> => {
    const raw = { "data":
        {
          "old": oldLocation.filePath,
          "new":newLocation.filePath
        }
      };
    const fullUrl = `${base_endpoint}${servicePath}/move`

    try {
      const response: IServiceResponse<INode> = await post<IServiceResponse<INode>>(fullUrl, raw);
      return response
    } catch {
      return failureServiceResponse("Failed to get node by path.")
    }

  }
}

export default NodeGateway