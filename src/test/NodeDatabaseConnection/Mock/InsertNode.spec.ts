import MockMongoDatabaseConnection from '../../../database/mongo/mock/MockMongoNodeDatabaseConnection';
import { createNode, INode, newFilePath } from 'hypertext-interfaces';

describe('Unit Test: Create Node', () => {
  const docDbConnection = new MockMongoDatabaseConnection()
  
  beforeAll(async done => {
    const response = await docDbConnection.clearNodeCollection()
    expect(response.success).toBeTruthy()
    done()
  })

  test("fails to insert invalid document", async done => {
    const doc: any = { 'id': 'id' }
    const response = await docDbConnection.insertNode(doc)
    expect(response.success).toBeFalsy()
    done()
  })

  test("inserts valid document", async done => {
    const doc: INode = createNode('a', 'a', newFilePath(['a']))
    const response = await docDbConnection.insertNode(doc)
    expect(response.success).toBeTruthy()
    done()
  })

  test("inserts invalid document with correct fields", async done => {
    const doc: INode = createNode('b', 'b', newFilePath(['a']))
    const response = await docDbConnection.insertNode(doc)
    expect(response.success).toBeTruthy()
    done()
  })
})