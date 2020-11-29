import INodeDatabaseConnection from "../../INodeDatabaseConnection";
import { Collection } from 'mongodb';
import MongoDbConnection from './mockMongodbConnection'
import { INode, IServiceResponse, tryCreateNode, IFilePath, successfulServiceResponse, failureServiceResponse, getServiceResponse } from "hypertext-interfaces"
import { getNode, getMongoNode, IMongoNode } from "../../helpers";
import { factory } from "typescript";

interface IMockNodeDatabaseConnection extends INodeDatabaseConnection {
  clearNodeCollection(): Promise<IServiceResponse<{}>>
  initTree(nodes: INode[]): Promise<IServiceResponse<{}>>
}

export default class MockMongoDatabaseConnection implements IMockNodeDatabaseConnection {

  _nodes: {[nodeId: string]: IMongoNode}

  constructor() {
    this._nodes = {}
  }

  async clearNodeCollection(): Promise<IServiceResponse<{}>> {
    this._nodes = {}
    return successfulServiceResponse({})
  }

  async initTree(nodes: INode[]): Promise<IServiceResponse<{}>> {
    nodes.forEach(node => {
      const mongonode = getMongoNode(node, 'create')
      if (mongonode.success)
        this._nodes[node.nodeId] = mongonode.payload
    })
    return successfulServiceResponse({})
  }

  async insertNode(node: INode): Promise<IServiceResponse<INode>> {
    if (this._nodes[node.nodeId])
      return failureServiceResponse('Node with this ID already exists.')
    else {
      const mongonode = getMongoNode(node, 'create')
      if (mongonode.success) {
        this._nodes[node.nodeId] = mongonode.payload
        return successfulServiceResponse(node)
      } else {
        return failureServiceResponse("Failed to parse mongo node")
      }
    }
  }

  async findNode(nodeId: string): Promise<IServiceResponse<INode>> {
    if (this._nodes[nodeId])
      return successfulServiceResponse(getNode(this._nodes[nodeId]))
    else {
      return failureServiceResponse('Node with this ID does not exist.')
    }
  }

  async findNodes(path: IFilePath): Promise<IServiceResponse<INode[]>> {
    let nodes: INode[]= []
    Object.values(this._nodes).forEach(node => {
      if (path.filePath.every((val, index) => {
        return index === node.filePath.findIndex(val2 => val === val2)
      }))
        nodes.push(getNode(node))
    })

    if (nodes.length === 0)
      return failureServiceResponse("No nodes found.")

    return successfulServiceResponse(nodes)
  }

  async getRoot(): Promise<IServiceResponse<INode[]>> {
    const allNodes = Object.values(this._nodes).map(mn => getNode(mn))
    return successfulServiceResponse(allNodes)
  }

  async updateNode(node: INode): Promise<IServiceResponse<INode>> {
    if (this._nodes[node.nodeId]) {
      const mongonode = getMongoNode(node, 'update')
      if (mongonode.success) {
        this._nodes[node.nodeId] = mongonode.payload
        return successfulServiceResponse(node)
      } else {
        return failureServiceResponse("Failed to parse mongo node")
      }
    } else {
      return failureServiceResponse('Node with this ID does not exist.')
    }
  }

  async updateNodes(nodes: INode[]): Promise<IServiceResponse<INode[]>> {
    let count = 0
    nodes.forEach(node => {
      if (this._nodes[node.nodeId]) {
        const mongonode = getMongoNode(node, 'update')
        if (mongonode.success) {
          this._nodes[node.nodeId] = mongonode.payload
          count++;
        }
      }
    })

    if (count < nodes.length)
      return failureServiceResponse('Failed to update all nodes')
    return successfulServiceResponse(nodes)
  }

  async deleteNode(nodeId: string): Promise<IServiceResponse<{}>> {
    delete this._nodes[nodeId]
    return successfulServiceResponse({})
  }

  async deleteNodes(nodeIds: string[]): Promise<IServiceResponse<{}>> {
    nodeIds.forEach(nid => delete this._nodes[nid])
    return successfulServiceResponse({})
  }
}