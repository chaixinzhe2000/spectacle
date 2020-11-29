import MockMongoDatabaseConnection from '../../../database/mongo/mock/MockMongoNodeDatabaseConnection';
import { createNode, INode, newFilePath } from 'hypertext-interfaces';
import initTestingTree from './initTestingTree';

describe('Update Nodes', () => {
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

  test("fails to update when array contains only invalid documents", async done => {
    const doc: any = { 'id': 'id' }
    const response = await docDbConnection.updateNodes([doc, {...doc}])
    expect(response.success).toBeFalsy()
    done()
  })

  test("fails to update when array contains some valid and some invalid documents", async done => {
    const doc: any = { 'id': 'id' }
    const doc2: INode = createNode('id1', 'new label', newFilePath(['id2', 'id1']))
    const response = await docDbConnection.updateNodes([doc, doc2])
    expect(response.success).toBeFalsy()
    done()
  })


  test("successfully updates single valid document", async done => {
    const doc1: INode = createNode('id1', 'new label', newFilePath(['id2', 'id1']))
    const response = await docDbConnection.updateNodes([doc1])
    expect(response.success).toBeTruthy()
    done()
  })

  test("successfully updates single valid document", async done => {
    const doc1: INode = createNode('id1', 'new label', newFilePath(['id2', 'id1']))
    const doc2: INode = createNode('id2', 'new label 2', newFilePath(['id2']))
    const response = await docDbConnection.updateNodes([doc1, doc2])
    expect(response.success).toBeTruthy()
    done()
  })

  test("fails to update valid document with invalid id", async done => {
    const doc: INode = createNode('a', 'a', newFilePath(['a']))
    const response = await docDbConnection.updateNodes([doc])
    expect(response.success).toBeFalsy()
    done()
  })
})