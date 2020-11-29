import MockMongoDatabaseConnection from '../../../database/mongo/mock/MockMongoNodeDatabaseConnection';
import { createNode, INode, newFilePath } from 'hypertext-interfaces';
import initTestingTree from './initTestingTree';

describe('Get Root - with file tree', () => {
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

  test("get root", async done => {
    const response = await docDbConnection.getRoot()
    expect(response.success).toBeTruthy()
    expect(response.payload.length).toBe(3)
    done()
  })
})

describe('Get Root - empty tree', () => {
  const docDbConnection = new MockMongoDatabaseConnection()
  
  beforeAll(async done => {
    const response = await docDbConnection.clearNodeCollection()
    expect(response.success).toBeTruthy()
    done()
  })

  test("get root", async done => {
    const response = await docDbConnection.getRoot()
    expect(response.success).toBeTruthy()
    expect(response.payload.length).toBe(0)
    done()
  })
})