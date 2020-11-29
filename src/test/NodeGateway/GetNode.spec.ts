import NodeGateway from '../../gateway/NodeGateway';
import MockMongoDatabaseConnection from '../../database/mongo/mock/MockMongoNodeDatabaseConnection';
import { INodeGateway } from "hypertext-interfaces"
import initTestingTree from '../NodeDatabaseConnection/Mock/initTestingTree';

const dbConnection = new MockMongoDatabaseConnection()

describe('Basic Unit Test: Get Node', () => {
  const nodeGateway: INodeGateway = new NodeGateway(dbConnection)

  beforeAll(async done => {
    const response = await dbConnection.clearNodeCollection()
    expect(response.success).toBeTruthy()

    const nodes = initTestingTree([{
      id: 'id',
      filePath: ['id']
    },
    {
      id: 'id2',
      filePath: ['id', 'id2']
    }])
    const createResponse = await dbConnection.initTree(nodes)
    expect(createResponse.success).toBeTruthy()
    done()
  })

  test("doesn't get non-existent node", async done => {
    const getResponse = await nodeGateway.getNode('bad_id')
    expect(getResponse.success).toBeFalsy()
    done()
  })

  test("successfully gets node", async done => {
    const getResponse = await nodeGateway.getNode('id')
    expect(getResponse.success).toBeTruthy()
    done()
  })

  test("successfully gets node and children", async done => {
    const getResponse = await nodeGateway.getNode('id')
    expect(getResponse.success).toBeTruthy()
    expect(getResponse.payload.children.length).toBe(1)
    expect(getResponse.payload.children[0].nodeId).toBe('id2')
    done()
  })
})