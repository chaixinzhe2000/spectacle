import DatabaseConnection from '../../dbConfig';

describe('Delete Nodes', () => {
  const docDbConnection = DatabaseConnection
  
  beforeAll(async done => {
    const response = await docDbConnection.clearNodeCollection()
    expect(response.success).toBeTruthy()
    done()

    const createResponse = await docDbConnection.initNodes([
      {
        nodeId: 'a',
        text: 'Test String 1.'
      },
      {
        nodeId: 'b',
        text: 'Test String 2'
      }
    ])
    expect(createResponse.success).toBeTruthy()
    done()
  })

  afterAll(async done => {
    const response = await docDbConnection.clearNodeCollection()
    expect(response.success).toBeTruthy()
    done()
  })

  test("deletes non-existent document", async done => {
    const response = await docDbConnection.deleteNode('a')
    expect(response.success).toBeTruthy()
    done()
  })

  test("deletes existent document", async done => {
    const response = await docDbConnection.deleteNode('c')
    expect(response.success).toBeTruthy()
    done()
  })
})