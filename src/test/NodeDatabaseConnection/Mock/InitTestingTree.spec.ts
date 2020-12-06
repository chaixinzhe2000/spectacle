import MockMongoDatabaseConnection from '../../../database/mongo/mock/MockMongoNodeDatabaseConnection';
import initTestingTree from './initTestingTree';

describe('Init Testing Tree', () => {
  const docDbConnection = new MockMongoDatabaseConnection()
  
  beforeAll(async done => {
    const response = await docDbConnection.clearNodeCollection()
    expect(response.success).toBeTruthy()
    done()
  })

  test("fails to insert invalid documents array", async done => {
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
})