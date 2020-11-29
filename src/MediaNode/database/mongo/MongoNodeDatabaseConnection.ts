import { ITestMediaNodeDatabaseConnection } from "../NodeDatabaseConnection";
import MongoDbConnection from "../../../mongodbConnection";
import {
  IServiceResponse,
  successfulServiceResponse,
  failureServiceResponse,
  IMediaNode,
  getServiceResponse,
} from "apposition-interfaces";
import { getMongoNode, IMongoIMediaNode, tryGetNode } from "../helpers";
import { getNodeCollection } from "./getCollection";

// TODO: completed by Chai
const MongoDatabaseConnection: ITestMediaNodeDatabaseConnection = {
  async clearNodeCollection(): Promise<IServiceResponse<{}>> {
    const collection = await getNodeCollection(MongoDbConnection);
    const response = await collection.deleteMany({});
    if (response.result.ok) {
      return successfulServiceResponse({});
    }
    return failureServiceResponse("Failed to clear node collection.");
  },

  async initNodes(nodes: IMediaNode[]): Promise<IServiceResponse<{}>> {
    const mongoNodes: IMongoIMediaNode[] = []

    nodes.forEach(node => {
      const mongoNodeResp = getMongoNode(node)
      if (!mongoNodeResp.success) {
        return failureServiceResponse(mongoNodeResp.message)
      }
      mongoNodes.push(mongoNodeResp.payload)
    })

    try {
      const collection = await getNodeCollection(MongoDbConnection);
      const insertResponse = await collection.insertMany(mongoNodes)
      if (insertResponse.result.ok) {
        return successfulServiceResponse({})
      }
    } catch (e) {
      return failureServiceResponse(`Failed to create new nodes.`)
    }
  },
  
  async insertNode(node: IMediaNode): Promise<IServiceResponse<IMediaNode>> {

    const mongoNodeResp = getMongoNode(node)
    if (!mongoNodeResp.success) {
      return failureServiceResponse(mongoNodeResp.message)
    }
    const mongoNode = mongoNodeResp.payload

    try {
      const collection = await getNodeCollection(MongoDbConnection);
      const insertResponse = await collection.insertOne(mongoNode)
      if (insertResponse.result.ok) {
        return successfulServiceResponse(node)
      }
    } catch (e) {
      return failureServiceResponse(`Failed to create new node, it's possible that a node with nodeId: ${node.nodeId} already exists.`)
    }

  },

  async findNode(nodeId: string): Promise<IServiceResponse<IMediaNode>> {

    const collection = await getNodeCollection(MongoDbConnection);
    const findResponse = await collection.findOne({ _id: nodeId })

    if (findResponse && findResponse._id === nodeId) {
      const tryCreateNodeResp = tryGetNode(findResponse)
      return getServiceResponse(tryCreateNodeResp, "Failed to find node\n")
    }
    return failureServiceResponse("Failed to find nodes")
  },

  async findNodes(nodeIds: string[]): Promise<IServiceResponse<{ [nodeId: string] : IMediaNode }>> {
    const collection = await getNodeCollection(MongoDbConnection);
    const myquery = { _id: { $in: nodeIds } };
    const findResponse = await collection.find(myquery)

    const nodes: { [nodeId: string] : IMediaNode } = {}
    await findResponse.forEach(mongonode => {
      const nodeResponse = tryGetNode(mongonode)
      if (nodeResponse.success)
        nodes[nodeResponse.payload.nodeId] = nodeResponse.payload
      })

    if (Object.keys(nodes).length === 0) {
      return failureServiceResponse("Failed to find any nodes at that path.")
    }
    return successfulServiceResponse(nodes)
  },

  async deleteNode(nodeId: string): Promise<IServiceResponse<{}>> {
    const collection = await getNodeCollection(MongoDbConnection);
    const deleteResponse = await collection.deleteOne({ _id: nodeId })
    if (deleteResponse.result.ok) {
      return successfulServiceResponse({})
    }
    return failureServiceResponse('Failed to delete')
  },
  
  async deleteNodes(nodeIds: string[]): Promise<IServiceResponse<{}>> {
    const collection = await getNodeCollection(MongoDbConnection);
    const myquery = { _id: { $in: nodeIds } };
    const deleteResponse = await collection.deleteMany(myquery)
    if (deleteResponse.result.ok) {
      return successfulServiceResponse({})
    }
    return failureServiceResponse('Failed to update nodes')
  }
};

export default MongoDatabaseConnection;
