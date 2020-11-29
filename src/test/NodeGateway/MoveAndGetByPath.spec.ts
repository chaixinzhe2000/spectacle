import NodeGateway from '../../gateway/NodeGateway';
import MockMongoDatabaseConnection from '../../database/mongo/mock/MockMongoNodeDatabaseConnection';
import { INodeGateway, newFilePath } from "hypertext-interfaces"
import initTestingTree from '../NodeDatabaseConnection/Mock/initTestingTree';

const dbConnection = new MockMongoDatabaseConnection()

jest.setTimeout(30000);
describe('Integration Test: Move Node - single child root', () => {
  const nodeGateway: INodeGateway = new NodeGateway(dbConnection)

  beforeEach(async done => {
    const nodes = initTestingTree([{
        id: 'a',
        filePath: ['a']
      },
      {
        id: 'aa',
        filePath: ['a', 'aa']
      },
      {
        id: 'aaa',
        filePath: ['a', 'aa', 'aaa']
      },
      {
        id: 'aaaa',
        filePath: ['a', 'aa', 'aaa', 'aaaa']
      }
    ])
    const initTreeResponse = await dbConnection.initTree(nodes)
    expect(initTreeResponse.success).toBeTruthy()
    done()
  })

  test("moves node", async done => {
    const getResponse = await nodeGateway.getNodeByPath(newFilePath(['a', 'aa']))
    expect(getResponse.success).toBeTruthy()
    expect(getResponse.payload.nodeId).toBe('aa')
    expect(getResponse.payload.children.length).toBe(1)
    
    const getResponse1 = await nodeGateway.getNodeByPath(newFilePath([]))
    expect(getResponse1.success).toBeTruthy()
    expect(getResponse1.payload.nodeId).toBe('/')
    expect(getResponse1.payload.children.length).toBe(1)

    const moveResponse = await nodeGateway.moveNode(newFilePath(['a', 'aa', 'aaa']), newFilePath(['a', 'aaa']))
    expect(moveResponse.success).toBeTruthy()

    const getResponse2 = await nodeGateway.getNodeByPath(newFilePath(['a', 'aa']))
    expect(getResponse2.success).toBeTruthy()
    expect(getResponse2.payload.nodeId).toBe('aa')
    expect(getResponse2.payload.children.length).toBe(0)

    const getResponse3 = await nodeGateway.getNodeByPath(newFilePath([]))
    expect(getResponse3.success).toBeTruthy()
    expect(getResponse3.payload.nodeId).toBe('/')
    expect(getResponse3.payload.children.length).toBe(1)
    done()
  })

  test("moves node - quadruple nested, move middle node to root", async done => {
    const getResponse = await nodeGateway.getNodeByPath(newFilePath(['a', 'aa']))
    expect(getResponse.success).toBeTruthy()
    expect(getResponse.payload.nodeId).toBe('aa')
    expect(getResponse.payload.children.length).toBe(1)
    expect(getResponse.payload.children[0].nodeId).toBe('aaa')
    
    const getResponse1 = await nodeGateway.getNodeByPath(newFilePath([]))
    expect(getResponse1.success).toBeTruthy()
    expect(getResponse1.payload.children.length).toBe(1)
    expect(getResponse1.payload.children[0].nodeId).toBe('a')

    const moveResponse = await nodeGateway.moveNode(newFilePath(['a', 'aa']), newFilePath(['aa']))
    expect(moveResponse.success).toBeTruthy()

    const getResponse2 = await nodeGateway.getNodeByPath(newFilePath(['a', 'aa']))
    expect(getResponse2.success).toBeFalsy()

    const getResponse3 = await nodeGateway.getNodeByPath(newFilePath(['aa']))
    expect(getResponse3.success).toBeTruthy()
    expect(getResponse3.payload.nodeId).toBe('aa')
    expect(getResponse3.payload.children.length).toBe(1)
    expect(getResponse3.payload.children[0].nodeId).toBe('aaa')
    expect(getResponse3.payload.children[0].children.length).toBe(1)
    expect(getResponse3.payload.children[0].children[0].nodeId).toBe('aaaa')

    const getResponse4 = await nodeGateway.getNodeByPath(newFilePath([]))
    expect(getResponse4.success).toBeTruthy()
    expect(getResponse4.payload.children.length).toBe(2)
    done()
  })
})

describe('Integration Test: Move Node - multiple child root', () => {
  const nodeGateway: INodeGateway = new NodeGateway(dbConnection)

  beforeAll(async done => {
    const nodes = initTestingTree([{
        id: 'a',
        filePath: ['a']
      },
      {
        id: 'b',
        filePath: ['b']
      },
      {
        id: 'aa',
        filePath: ['a', 'aa']
      },
      {
        id: 'aaa',
        filePath: ['a', 'aa', 'aaa']
      }
    ])
    const initTreeResponse = await dbConnection.initTree(nodes)
    expect(initTreeResponse.success).toBeTruthy()
    done()
  })

  test("moves node", async done => {
    const getResponse = await nodeGateway.getNodeByPath(newFilePath(['b']))
    expect(getResponse.success).toBeTruthy()
    expect(getResponse.payload.nodeId).toBe('b')
    expect(getResponse.payload.children.length).toBe(0)

    const moveResponse = await nodeGateway.moveNode(newFilePath(['a', 'aa', 'aaa']), newFilePath(['b', 'aaa']))
    expect(moveResponse.success).toBeTruthy()
    
    const getResponse2 = await nodeGateway.getNodeByPath(newFilePath(['b']))
    expect(getResponse2.success).toBeTruthy()
    expect(getResponse2.payload.nodeId).toBe('b')
    expect(getResponse2.payload.children.length).toBe(1)
    expect(getResponse2.payload.children[0].nodeId).toBe('aaa')

    const getResponse3 = await nodeGateway.getNodeByPath(newFilePath(['b', 'aaa']))
    expect(getResponse3.success).toBeTruthy()
    expect(getResponse3.payload.nodeId).toBe('aaa')
    expect(getResponse3.payload.children.length).toBe(0)
    done()
  })
})