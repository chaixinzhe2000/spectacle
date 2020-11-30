import DatabaseConnection from '../../dbConfig';


describe('Init Testing Tree', () => {
  const docDbConnection = DatabaseConnection
  
  beforeAll(async done => {
    const response = await docDbConnection.clearNodeCollection()
    expect(response.success).toBeTruthy()
    done()
  })

  test("inits nodes", async done => {
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
})