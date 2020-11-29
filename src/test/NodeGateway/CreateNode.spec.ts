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
  
  test("doesn't create invalid node", async done => {
    const badnode: any = { 'id': 'id' }
    const response = await nodeGateway.createNode(badnode)
    expect(response.success).toBeFalsy()
    done()
  })

  test("creates valid node", async done => {
    const validnode: INode = createNode('id', 'test-valid-node', newFilePath(['id']))
    const response = await nodeGateway.createNode(validnode)
    expect(response.success).toBeTruthy()
    done()
  })

  test("creates node without node type", async done => {
    const validnode: any = {
      nodeId: 'node.x',
      filePath: ['node.x'],
      label: 'label'
    }
    const response = await nodeGateway.createNode(validnode)
    expect(response.success).toBeTruthy()
    done()
  })

  test("creates valid node, fails to create valid node with same id", async done => {
    const validnode: INode = createNode('id3', 'test-valid-node', newFilePath(['id3']))
    const response = await nodeGateway.createNode(validnode)
    expect(response.success).toBeTruthy()

    const validnode2: INode = createNode('id3', 'test-valid-node', newFilePath(['id3']))
    const response2 = await nodeGateway.createNode(validnode2)
    expect(response2.success).toBeFalsy()
    done()
  })


  test("creates valid node, creates child of that node, finds that", async done => {
    const validnode: INode = createNode('id4', 'test-valid-node', newFilePath(['id4']))
    const response = await nodeGateway.createNode(validnode)
    expect(response.success).toBeTruthy()

    const findNodesResponse = await dbConnection.findNodes(validnode.filePath)
    expect(findNodesResponse.success).toBeTruthy()
    expect(findNodesResponse.payload.length).toBe(1)

    const validnode2: INode = createNode('id4_child', 'test-child-node', newFilePath(['id4', 'id4_child']))
    const response2 = await nodeGateway.createNode(validnode2)
    expect(response2.success).toBeTruthy()

    const findResponse = await dbConnection.findNode(validnode2.nodeId)
    expect(findResponse.success).toBeTruthy()

    const findNodesResponse2 = await dbConnection.findNodes(validnode.filePath)
    expect(findNodesResponse2.success).toBeTruthy()
    expect(findNodesResponse2.payload.length).toBe(2)
    done()
  })

  test("fails to create when end of filepath != nodeId", async done => {
    const invalidnode: INode = createNode('id2', 'test-valid-node', newFilePath(['id']))
    const response = await nodeGateway.createNode(invalidnode)
    expect(response.success).toBeFalsy()
    done()
  })

  test("fails to create node when filepath is invalid", async done => {
    const invalidnode: INode = createNode('id2', 'test-valid-node', newFilePath(['home', 'id2']))
    const response = await nodeGateway.createNode(invalidnode)
    expect(response.success).toBeFalsy()
    done()
  })
})