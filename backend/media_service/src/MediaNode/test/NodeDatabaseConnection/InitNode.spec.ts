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
        mediaUrl: "https://www.youtube.com/watch?v=kQqdf484iyc"
      },
      {
        nodeId: 'b',
        mediaUrl: "https://www.youtube.com/watch?v=kQqdf484iyc"
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