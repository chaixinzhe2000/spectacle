import INodeDatabaseConnection from "../INodeDatabaseConnection";
import { Collection } from 'mongodb';
import MongoDbConnection from './mongodbConnection'
import { INode, IFilePath, tryCreateNode, getServiceResponse, successfulServiceResponse, failureServiceResponse, IServiceResponse } from "spectacle-interfaces"
import { getNode, getMongoNode, IMongoNode } from "../helpers";

export async function getNodeCollection(): Promise<Collection> {
  try {
      const client = await MongoDbConnection.Get();
      const db = client.db()
      const collection = db.collection('nodes');
      return collection;
  } catch (e) {
      console.log(e)
      return e;
  }
}

const MongoDatabaseConnection: INodeDatabaseConnection = {

  async insertNode(node: INode): Promise<IServiceResponse<INode>> {
  
    const mongoNodeResp = getMongoNode(node, 'create')
    if (!mongoNodeResp.success) {
      return failureServiceResponse(mongoNodeResp.message)
    }
    const mongoNode = mongoNodeResp.payload

    try {
      const collection = await getNodeCollection();
      const insertResponse = await collection.insertOne(mongoNode)
    
      if (insertResponse.result.ok) {
        return successfulServiceResponse(getNode(mongoNode))
      }
    } catch (e) {
      return failureServiceResponse(`Failed to create new node, it's possible that a node with nodeId: ${node.nodeId} already exists.`)
    }
  },

  async findNode(nodeId: string): Promise<IServiceResponse<INode>> {
    const collection = await getNodeCollection();
    const findResponse = await collection.findOne({ _id: nodeId })

    if (findResponse && findResponse._id === nodeId) {
      const node = getNode(findResponse)
      const tryCreateNodeResp = tryCreateNode(node)
      return getServiceResponse(tryCreateNodeResp, "Failed to find node\n")
    }

    return failureServiceResponse("")

  },

  async findNodes(filePath: IFilePath): Promise<IServiceResponse<INode[]>> {
    let nodeId: string = ''
    let filePathExp: string = ''
  
    filePathExp = filePath.filePath.join(',')
    nodeId = filePath.nodeId
    const collection = await getNodeCollection();
    const findResponse = await collection.find({
        path: { $regex: `^,${filePathExp},` }
    })
  
    let nodes: INode[] = []
  
    await findResponse.forEach(mongonode => {
      const node = getNode(mongonode)
      const tryNodeResponse = tryCreateNode(node)
      if (tryNodeResponse.success) {
        nodes.push(tryNodeResponse.payload)
      } else {
        return failureServiceResponse("Failed to create node: \n" + tryNodeResponse.message)
      }
    })

    if (nodes.length === 0) {
      return failureServiceResponse("Failed to find any nodes at that path.")
    }

    return successfulServiceResponse(nodes)
  },

  async getRoot(): Promise<IServiceResponse<INode[]>> {
    
    const collection = await getNodeCollection();
    const findResponse = await collection.find({})
  
    let nodes: INode[] = []
  
    await findResponse.forEach(mongonode => {
      const node = getNode(mongonode)
      const tryNodeResponse = tryCreateNode(node)
      if (tryNodeResponse.success) {
        nodes.push(tryNodeResponse.payload)
      } else {
        return failureServiceResponse("Failed to create node: \n" + tryNodeResponse.message)
      }
    })

    return successfulServiceResponse(nodes)
  },

  async updateNode(node: INode): Promise<IServiceResponse<INode>> {

    const mongoNodeResp = getMongoNode(node, 'update')
    if (!mongoNodeResp.success) {
      return failureServiceResponse(mongoNodeResp.message)
    }
    const mongoNode = mongoNodeResp.payload
    const collection = await getNodeCollection();
    const updateResponse = await collection.updateOne({ _id: node.nodeId }, { $set: mongoNode });
    
    if (updateResponse.result.ok && updateResponse.result.n === 1) {
      return successfulServiceResponse(getNode(mongoNode))
    }

    return failureServiceResponse('Failed to update')
  },

  async updateNodes(nodes: INode[]): Promise<IServiceResponse<{}>> {
    const collection = await getNodeCollection();
    const bulk = collection.initializeUnorderedBulkOp()
    
    const mongonodes: IMongoNode[] = []
    for (const node of nodes) {
      const mongoNodeResp = getMongoNode(node, 'update')
      if (!mongoNodeResp.success) {
        return failureServiceResponse(mongoNodeResp.message)
      }
      mongonodes.push(mongoNodeResp.payload)
    }
    
    mongonodes.forEach(mnode => {
      bulk.find({ _id: mnode._id}).update({ $set: mnode })
    })
    const bulkResponse = await bulk.execute()

    if (bulkResponse.ok) {
      return successfulServiceResponse({})
    }

    return failureServiceResponse('Failed to update nodes')
  },

  async deleteNode(nodeId: string): Promise<IServiceResponse<{}>> {
    const collection = await getNodeCollection();
    const deleteResponse = await collection.deleteOne({ _id: nodeId })

    if (deleteResponse.result.ok) {
      return successfulServiceResponse({})
    }
    
    return failureServiceResponse('Failed to delete')
  },

  async deleteNodes(nodeIds: string[]): Promise<IServiceResponse<{}>> {
    const collection = await getNodeCollection();
    
    const myquery = { _id: { $in: nodeIds } };
    const deleteResponse = await collection.deleteMany(myquery)

    if (deleteResponse.result.ok) {
      return successfulServiceResponse({})
    }

    return failureServiceResponse('Failed to update nodes')
  }
}

export default MongoDatabaseConnection