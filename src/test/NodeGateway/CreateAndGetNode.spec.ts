import NodeGateway from '../../gateway/NodeGateway';
import MockMongoDatabaseConnection from '../../database/mongo/mock/MockMongoNodeDatabaseConnection';
import { INodeGateway,  INode,  createNode, newFilePath } from "hypertext-interfaces"

const dbConnection = new MockMongoDatabaseConnection()

describe('Unit Test: Create Node', () => {
  const nodeGateway: INodeGateway = new NodeGateway(dbConnection)

  beforeAll(async done => {
    const response = await dbConnection.clearNodeCollection()
    expect(response.success).toBeTruthy()
    done()
  })

  afterAll(async done => {
    const response = await dbConnection.clearNodeCollection()
    expect(response.success).toBeTruthy()
    done()
  })

  test("creates node and gets node with immutable text type", async done => {
    const validnode: INode = {
        nodeId: 'node.text.x',
        nodeType: 'immutable-text',
        filePath: newFilePath(['node.text.x']),
        children: [],
        label: 'test node'
    }
    const response = await nodeGateway.createNode(validnode)
    expect(response.success).toBeTruthy()
    expect(response.payload).toStrictEqual(validnode)


    const getResponse = await nodeGateway.getNode(validnode.nodeId)
    expect(getResponse.success).toBeTruthy()
    expect(getResponse.payload).toStrictEqual(validnode)

    const getResponse2 = await nodeGateway.getNodeByPath(validnode.filePath)
    expect(getResponse2.success).toBeTruthy()
    expect(getResponse2.payload).toStrictEqual(validnode)
    done()
  })

  test("creates node and gets node with immutable text type", async done => {
    const validnode: INode = {
        nodeId: 'node.text.xyx',
        nodeType: 'node',
        filePath: newFilePath(['node.text.xyx']),
        children: [],
        label: 'test node'
    }
    const response = await nodeGateway.createNode(validnode)
    expect(response.success).toBeTruthy()
    expect(response.payload).toStrictEqual(validnode)


    const getResponse = await nodeGateway.getNode(validnode.nodeId)
    expect(getResponse.success).toBeTruthy()
    expect(getResponse.payload).toStrictEqual(validnode)

    const getResponse2 = await nodeGateway.getNodeByPath(validnode.filePath)
    expect(getResponse2.success).toBeTruthy()
    expect(getResponse2.payload).toStrictEqual(validnode)
    done()
  })
})