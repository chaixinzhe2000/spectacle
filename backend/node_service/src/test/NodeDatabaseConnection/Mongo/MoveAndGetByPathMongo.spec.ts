import NodeGateway from '../../../gateway/NodeGateway';
import MongoDatabaseConnection from '../../../database/mongo/MongoNodeDatabaseConnection';
import { INodeGateway, newFilePath, createNode } from "spectacle-interfaces"

jest.setTimeout(30000);

describe('Integration Test: Move Node', () => {
  const nodeGateway: INodeGateway = new NodeGateway(MongoDatabaseConnection)
  const node1 = createNode('a', 'a', newFilePath(['a']))
  const node2 = createNode('aa', 'aa', newFilePath(['a', 'aa']))
  const node3 = createNode('aaa', 'aaa', newFilePath(['a', 'aa', 'aaa']))
  const node4 = createNode('aaaa', 'aaaa', newFilePath(['a', 'aa', 'aaa', 'aaaa']))

  beforeEach(async done => {

    const delete1 = await nodeGateway.deleteNode(node1.nodeId)
    const create1 = await nodeGateway.createNode(node1)
    if (!create1.success) {
      const update1 = await nodeGateway.updateNode(node1)
      expect(update1.success).toBeTruthy()
    } else {
      expect(create1.success).toBeTruthy()
    }

    const create2 = await nodeGateway.createNode(node2)
    if (!create2.success) {
      const update2 = await nodeGateway.updateNode(node2)
      expect(update2.success).toBeTruthy()
    } else {
      expect(create2.success).toBeTruthy()
    }

    const create3 = await nodeGateway.createNode(node3)
    if (!create3.success) {
      const update3 = await nodeGateway.updateNode(node3)
      expect(update3.success).toBeTruthy()
    } else {
      expect(create3.success).toBeTruthy()
    }

    const create4 = await nodeGateway.createNode(node4)
    if (!create4.success) {
      const update4 = await nodeGateway.updateNode(node4)
      expect(update4.success).toBeTruthy()
    } else {
      expect(create4.success).toBeTruthy()
    }

    done()
  })

  afterEach(async done => {
    const delete1 = await nodeGateway.deleteNode(node1.nodeId)
    expect(delete1.success).toBeTruthy()

    const delete2 = await nodeGateway.deleteNode(node2.nodeId)
    expect(delete2.success).toBeTruthy()

    const delete3 = await nodeGateway.deleteNode(node3.nodeId)
    expect(delete3.success).toBeTruthy()

    const delete4 = await nodeGateway.deleteNode(node4.nodeId)
    expect(delete4.success).toBeTruthy()
    done()
  })

  test("moves node", async done => {
    const getResponse = await nodeGateway.getNodeByPath(newFilePath(['a', 'aa']))
    expect(getResponse.success).toBeTruthy()
    expect(getResponse.payload.nodeId).toBe('aa')
    expect(getResponse.payload.children.length).toBe(1)
    
    const getResponse1 = await nodeGateway.getNodeByPath(newFilePath([]))
    expect(getResponse1.success).toBeTruthy()

    const moveResponse = await nodeGateway.moveNode(newFilePath(['a', 'aa', 'aaa']), newFilePath(['a', 'aaa']))
    expect(moveResponse.success).toBeTruthy()

    const getResponse2 = await nodeGateway.getNodeByPath(newFilePath(['a', 'aa']))
    expect(getResponse2.success).toBeTruthy()
    expect(getResponse2.payload.nodeId).toBe('aa')
    expect(getResponse2.payload.children.length).toBe(0)

    const getResponse3 = await nodeGateway.getNodeByPath(newFilePath([]))
    expect(getResponse3.success).toBeTruthy()
    done()
  })
})

