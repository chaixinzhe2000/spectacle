import MockMongoDatabaseConnection from '../../../database/mongo/mock/MockMongoNodeDatabaseConnection';
import initTestingTree from './initTestingTree';

describe('Find Node', () => {
  const nodeDbConnection = new MockMongoDatabaseConnection()
  
  beforeAll(async done => {
    const response = await nodeDbConnection.clearNodeCollection()
    expect(response.success).toBeTruthy()

    const nodes = initTestingTree([{
            id: 'id1',
            filePath: ['id1']
        },
        {
            id: 'id2',
            filePath: ['id2']
        }
    ])
    const createResponse = await nodeDbConnection.initTree(nodes)
    expect(createResponse.success).toBeTruthy()
    done()
  })

  test("fails to find non-existent node", async done => {
    const response = await nodeDbConnection.findNode('invalid')
    expect(response.success).toBeFalsy()
    done()
  })

  test("finds node", async done => {
    const response = await nodeDbConnection.findNode('id1')
    expect(response.success).toBeTruthy()
    expect(response.payload.nodeId).toBe('id1')
    done()
  })
})