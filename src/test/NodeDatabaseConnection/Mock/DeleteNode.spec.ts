import MockMongoDatabaseConnection from '../../../database/mongo/mock/MockMongoNodeDatabaseConnection';
import initTestingTree from './initTestingTree';

describe('Delete Nodes', () => {
  const docDbConnection = new MockMongoDatabaseConnection()
  
  beforeAll(async done => {
    const response = await docDbConnection.clearNodeCollection()
    expect(response.success).toBeTruthy()

    const documents = initTestingTree([{
            id: 'id1',
            filePath: ['id1']
        },
        {
            id: 'id2',
            filePath: ['id2']
        }
    ])
    const createResponse = await docDbConnection.initTree(documents)
    expect(createResponse.success).toBeTruthy()
    done()
  })

  test("deletes non-existent document", async done => {
    const response = await docDbConnection.deleteNode('invalid')
    expect(response.success).toBeTruthy()
    done()
  })

  test("deletes existent document", async done => {
    const response = await docDbConnection.deleteNode('id1')
    expect(response.success).toBeTruthy()
    done()
  })
})