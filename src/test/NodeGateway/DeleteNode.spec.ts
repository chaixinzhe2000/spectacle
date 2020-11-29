import NodeGateway from '../../gateway/NodeGateway';
import MockMongoDatabaseConnection from '../../database/mongo/mock/MockMongoNodeDatabaseConnection';
import { INodeGateway, newFilePath } from "hypertext-interfaces"
import initTestingTree from '../NodeDatabaseConnection/Mock/initTestingTree';

const dbConnection = new MockMongoDatabaseConnection()

describe('Unit Test: Get Node', () => {
  const nodeGateway: INodeGateway = new NodeGateway(dbConnection)

  beforeEach(async done => {
    const response = await dbConnection.clearNodeCollection()
    expect(response.success).toBeTruthy()
    
    const nodes = initTestingTree([{
        id: 'id1',
        filePath: ['id1']
    },
    {
      id: 'id2',
      filePath: ['id1', 'id2']
    }])
    const createResponse = await dbConnection.initTree(nodes)
    expect(createResponse.success).toBeTruthy()
    done()
  })

  test("deletes non-existent node", async done => {
    const deleteResponse = await nodeGateway.deleteNode('bad_id')
    expect(deleteResponse.success).toBeTruthy()
    done()
  })

  test("successfully deletes existing node", async done => {
    const findResponse = await dbConnection.findNode('id2')
    expect(findResponse.success).toBeTruthy()

    const deleteResponse = await nodeGateway.deleteNode('id2')
    expect(deleteResponse.success).toBeTruthy()
    
    const findResponse2 = await dbConnection.findNode('id2')
    expect(findResponse2.success).toBeFalsy()
    done()
  })

  test("successfully deletes existing node and it's children", async done => {
    const findResponse = await dbConnection.findNodes(newFilePath(['id1']))
    expect(findResponse.success).toBeTruthy()
    expect(findResponse.payload.length).toBe(2)

    const deleteResponse = await nodeGateway.deleteNode('id1')
    expect(deleteResponse.success).toBeTruthy()

    const findResponse2 = await dbConnection.findNodes(newFilePath(['id1']))
    expect(findResponse2.success).toBeFalsy()

    const findResponse3 = await dbConnection.findNodes(newFilePath(['id1', 'id2']))
    expect(findResponse3.success).toBeFalsy()

    const findResponse4 = await dbConnection.findNode('id2')
    expect(findResponse4.success).toBeFalsy()
    done()
  })
})