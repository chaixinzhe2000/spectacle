import NodeGateway from '../../gateway/NodeGateway';
import MockMongoDatabaseConnection from '../../database/mongo/mock/MockMongoNodeDatabaseConnection';
import { INodeGateway, createNode, INode, newFilePath } from 'spectacle-interfaces';
import initTestingTree from '../NodeDatabaseConnection/Mock/initTestingTree';

const dbConnection = new MockMongoDatabaseConnection()

describe('Unit Test: Update Node', () => {
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
    ])
    const initTreeResponse = await dbConnection.initTree(nodes)
    expect(initTreeResponse.success).toBeTruthy()
    done()
  })
  
  test("doesn't update invalid node", async done => {
    const invalidNode: any = { 'id': 'id' }
    const response = await nodeGateway.updateNode(invalidNode)
    expect(response.success).toBeFalsy()
    done()
  })

  test("updates node", async done => {
    const validNode: INode = createNode('a', 'test', newFilePath(['a']))
    const response = await nodeGateway.updateNode(validNode)
    expect(response.success).toBeTruthy()
    expect(response.payload.label).toBe('test')
    done()
  })

  test("fails to update non-existing node", async done => {
    const invalidNode: INode = createNode('c', 'test', newFilePath(['c']))
    const response = await nodeGateway.updateNode(invalidNode)
    expect(response.success).toBeFalsy()
    done()
  })

  test("fails to update with incorrect path", async done => {
    const invalidNode: INode = createNode('b', 'test', newFilePath(['a']))
    const response = await nodeGateway.updateNode(invalidNode)
    expect(response.success).toBeFalsy()
    done()
  })
})