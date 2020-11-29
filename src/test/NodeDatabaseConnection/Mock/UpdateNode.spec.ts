import MockMongoDatabaseConnection from '../../../database/mongo/mock/MockMongoNodeDatabaseConnection';
import { createNode, INode, newFilePath } from 'hypertext-interfaces';
import initTestingTree from './initTestingTree';

describe('Unit Test: Create Node', () => {
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

  test("fails to update invalid document", async done => {
    const doc: any = { 'id': 'id' }
    const response = await docDbConnection.updateNode(doc)
    expect(response.success).toBeFalsy()
    done()
  })

  test("fails to update valid document with invalid id", async done => {
    const doc: INode = createNode('a', 'a', newFilePath(['a']))
    const response = await docDbConnection.updateNode(doc)
    expect(response.success).toBeFalsy()
    done()
  })

  test("successfully updates document", async done => {
    const doc: INode = createNode('id1', 'new label', newFilePath(['id2', 'id1']))
    const response = await docDbConnection.updateNode(doc)
    expect(response.success).toBeTruthy()
    done()
  })
})