import INodeDatabaseConnection from "../database/INodeDatabaseConnection"
import { INodeGateway, INode, IServiceResponse, IFilePath, newFilePath, failureServiceResponse, tryCreateNode, isFilePath, successfulServiceResponse } from "hypertext-interfaces"

export default class NodeGateway implements INodeGateway {

  dbConnection: INodeDatabaseConnection

  constructor(nodeDbConnection: INodeDatabaseConnection) {
    this.dbConnection = nodeDbConnection
  }

  /**
   * Stores a new node in the database when given valid arguments.
   * 
   * @param node - node to create
   * 
   * Returns a failure service response if:
   *  - an invalid node object is passed as an argument
   *  - a node with the same id already exists
   *  - given an invalid file path
   */
  async createNode(node: INode): Promise<IServiceResponse<INode>> {
    const typeCheckNode = tryCreateNode(node)
    
    if (!typeCheckNode.success) {
      return typeCheckNode
    }
    if (typeCheckNode.payload.filePath.parent.length > 0) {
      const checkFilePath = await this.getNodeByPath(newFilePath(typeCheckNode.payload.filePath.parent))
      if (!checkFilePath.success) {
        return checkFilePath
      }
    }

    const dbConnectionResponse = await this.dbConnection.insertNode(typeCheckNode.payload)
    return dbConnectionResponse
  }
  
  /**
   * Gets a Node (and it's children) from the database by node id.
   * 
   * @param nodeId - id of node to retrieve
   * 
   * Returns a failure service response if:
   *  - the id does not exist in the database
   */
  async getNode(nodeId: string): Promise<IServiceResponse<INode>> {
    const dbConnectionResponse = await this.dbConnection.findNode(nodeId)
    if (!dbConnectionResponse.success)
      return dbConnectionResponse
    else {
      const nodeResponse = await this.getNodeByPath(dbConnectionResponse.payload.filePath)
      return nodeResponse
    }
  }
  
  /**
   * Updates an existing node in the database. 
   * 
   * @param node - node to update
   * 
   * Returns a failure service response if:
   *  - an invalid node object is passed as an argument
   *  - a node with the same id does not already exist
   *  - given an invalid file path
   */
  async updateNode(node: INode): Promise<IServiceResponse<INode>> {
    const typeCheckNode = tryCreateNode(node)
    if (!typeCheckNode.success) {
      return typeCheckNode
    }

    const nodeResponse = await this.dbConnection.findNode(typeCheckNode.payload.nodeId)
    if (!nodeResponse.success)
      return failureServiceResponse("Cannot update a node that doesn't exist.")

    const dbConnectionResponse = await this.dbConnection.updateNode(typeCheckNode.payload)
    return dbConnectionResponse
  }
    
  /**
   * Deletes a node (and all of it's children) in the database.
   * 
   * @param nodeId - id of node to delete
   * 
   * Returns a successful service response if:
   *  - the node no longer exists in the database, even if already it didn't exist before
   * 
   * Returns a failure service response if:
   *  - the database fails to delete the node
   */
  async deleteNode(nodeId: string): Promise<IServiceResponse<{}>> {
    const getDeletedNode = await this.dbConnection.findNode(nodeId)
    if (getDeletedNode.success) {
      const getDeletedNodeChildren = await this.dbConnection.findNodes(getDeletedNode.payload.filePath)
      if (getDeletedNodeChildren.success) {
        const deleteIds: string[] = getDeletedNodeChildren.payload.map(node => node.nodeId)
        const deleteResponse = await this.dbConnection.deleteNodes(deleteIds)
        return deleteResponse
      } else {
        return failureServiceResponse("Failed to delete this node and it's children.")
      }
    } 
    
    return successfulServiceResponse({})
  }

  /**
   * Gets a node (and it's children) by file path. 
   * Passing an empty filePath should return the full file tree.
   * 
   * @param filePath - file path of node to get
   *  - the last element of the full filepath is the nodeId of the node to get
   * 
   * Returns a successful service response if:
   *  - there exists a node at the given file path
   * 
   * Returns a failure service response if:
   *  - no node exists at the given file path
   *  - an invalid file path is given
   */
  async getNodeByPath(filePath: IFilePath): Promise<IServiceResponse<INode>> {
    if (isFilePath(filePath))
      return await this.getFileTree(filePath)
    else
      return failureServiceResponse("Input must be a valid file path.")
  }


  /**
   * Moves a node (and it's children) from an old file location to a new file location. 
   * 
   * @param oldLocation - the location of the node that is being moved
   * @param newLocation - the new location your are moving the node to
   * 
   * Returns a failure service response if:
   *  - either file locations are invalid
   *  - no node exists at the old location
   *  - no node exists at the parent of the new location (unless the part is the root)
   */
  async moveNode(oldLocation: IFilePath, newLocation: IFilePath): Promise<IServiceResponse<{}>> {
    let resp: IServiceResponse<{}> = {
      success: false,
      message: '',
      payload: null
    }

    if (oldLocation.nodeId !== newLocation.nodeId) {
      return failureServiceResponse("End of file path must be equal in old and new location.")
    }
    
    if ([...new Set(newLocation.filePath)].length !== newLocation.filePath.length) {
      return failureServiceResponse("Cannot move a node to be a child of itself.")
    }
    
    try {
      const oldNodeResponse = await this.dbConnection.findNodes(oldLocation)
      const newNodeResponse = await this.dbConnection.findNodes(newFilePath(newLocation.parent))

      if (oldNodeResponse.success && oldNodeResponse.payload.length > 0 && 
        ((newNodeResponse.success && newNodeResponse.payload.length > 0) || newLocation.filePath.length === 1)) {
        let nodes: INode[] = []
        oldNodeResponse.payload.map(node => {
          let newNode = { ...node }
          let relativePath = newNode.filePath.filePath.filter((el: string) => !oldLocation.filePath.includes(el))
          newNode.filePath = newFilePath(newLocation.filePath.concat(relativePath))
          nodes.push(newNode)
        })

        const updateResponse = await this.dbConnection.updateNodes(nodes)

        if (!updateResponse.success) {
          resp.message = updateResponse.message
          return resp
        }

        resp.success = true

      } else {
        resp.message = oldNodeResponse.message.concat("\n").concat(newNodeResponse.message)
      }
    } catch (e) {
      console.log(e)
      resp.message = "Failed to find node at location: " + oldLocation.filePath.join(', ')
    }

    return resp
  }


  private async getFileTree(fp: IFilePath | string[]): Promise<IServiceResponse<INode>> {
    let resp: IServiceResponse<INode> = failureServiceResponse('')

    const filePath: IFilePath = isFilePath(fp) ? fp : newFilePath(fp)
    let dbConnectionResponse;
    if (filePath.filePath.length === 0) {
      dbConnectionResponse = await this.dbConnection.getRoot()
    } else {
      dbConnectionResponse = await this.dbConnection.findNodes(filePath)
    }


    if (!dbConnectionResponse.success) {
      resp.message = dbConnectionResponse.message
      return resp
    }
  
    let children = dbConnectionResponse.payload
    children.sort((a, b) => a.filePath.filePath.length - b.filePath.filePath.length)

    const result = await children.reduce((a, node) => {
      let path = [ ...node.filePath.filePath ]
      const relativePath = path.filter((nodeId: string) => !filePath.filePath.includes(nodeId))
      if (filePath.nodeId) relativePath.unshift(filePath.nodeId)
      this.addChildren(a, node, relativePath);
      return a;
    }, []);
  
    if (filePath.filePath.length === 0) {
      resp.payload = {
        nodeId: '/',
        label: 'Root',
        filePath: newFilePath([]),
        nodeType: 'node',
        children: result
      }
      resp.success = true
    } else if (result.length === 1) {
      resp.payload = result[0]
      resp.success = true
    } else {
      resp.message = "Couldn't find root node."
    }
  
    return resp
  }

  private addChildren(nodes: INode[], node: INode, filePath: string[]) {
    let root = filePath.shift()
    if(!filePath.length) {
      nodes.push(node);
    } else {
      const i = nodes.findIndex(({ nodeId }) => nodeId === root);
      if (i >= 0)
        this.addChildren(nodes[i].children, node, filePath);
    }
  }
}