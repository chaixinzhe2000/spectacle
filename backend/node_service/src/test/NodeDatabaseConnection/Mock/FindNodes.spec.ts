import MockMongoDatabaseConnection from '../../../database/mongo/mock/MockMongoNodeDatabaseConnection';
import { newFilePath } from 'spectacle-interfaces';
import initTestingTree from './initTestingTree';

describe('Find Nodes', () => {
  const docDbConnection = new MockMongoDatabaseConnection()
  
  beforeAll(async done => {
    const response = await docDbConnection.clearNodeCollection()
    expect(response.success).toBeTruthy()

    const documents = initTestingTree([{
            id: 'id1',
            filePath: ['id1']
        },
        {
            id: 'id3',
            filePath: ['id1', 'id3']
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

  test("fails to find documents with invalid path", async done => {
    const response = await docDbConnection.findNodes(newFilePath(['id3']))
    expect(response.success).toBeFalsy()
    done()
  })

  test("fails to find documents with other invalid path", async done => {
    const response = await docDbConnection.findNodes(newFilePath(['something']))
    expect(response.success).toBeFalsy()
    done()
  })

  test("finds documents with valid path", async done => {
    const response = await docDbConnection.findNodes(newFilePath(['id1']))
    expect(response.success).toBeTruthy()
    expect(response.payload.length).toBe(2)
    done()
  })

  test("finds documents with valid path", async done => {
    const response = await docDbConnection.findNodes(newFilePath(['id2']))
    expect(response.success).toBeTruthy()
    expect(response.payload.length).toBe(1)
    done()
  })
})