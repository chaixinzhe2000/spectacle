import DatabaseConnection from '../../dbConfig';

describe('Find Nodes', () => {
  const docDbConnection = DatabaseConnection

  afterAll(async done => {
    const response = await docDbConnection.clearNodeCollection()
    expect(response.success).toBeTruthy()
    done()
  })

  test("fails to find node with invalid path", async done => {
    const dresponse = await docDbConnection.clearNodeCollection()
    expect(dresponse.success).toBeTruthy() 

    const response = await docDbConnection.findNodes(['id3'])
    expect(response.success).toBeFalsy()
    done()
  })

  test("finds two nodes", async done => {
    const dresponse = await docDbConnection.clearNodeCollection()
    expect(dresponse.success).toBeTruthy() 

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

    const response = await docDbConnection.findNodes(['a', 'b'])
    expect(response.success).toBeTruthy()
    expect(Object.keys(response.payload).length).toBe(2)

    const response2 = await docDbConnection.findNodes(['a'])
    expect(response2.success).toBeTruthy()
    expect(Object.keys(response2.payload).length).toBe(1)
    done()
  })
})