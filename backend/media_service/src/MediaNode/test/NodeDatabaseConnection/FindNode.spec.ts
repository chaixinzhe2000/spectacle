import DatabaseConnection from '../../dbConfig';

describe('Find Node', () => {

  test("finds node", async done => {
    const dResponse = await DatabaseConnection.clearNodeCollection()
    expect(dResponse.success).toBeTruthy()

    const createResponse = await DatabaseConnection.initNodes([
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

    const response = await DatabaseConnection.findNode('b')
    expect(response.success).toBeTruthy()
    expect(response.payload.nodeId).toBe('b')
    expect(response.payload.mediaUrl).toBe("https://www.youtube.com/watch?v=kQqdf484iyc")
    done()
  })

  test("fails to find non-existent node", async done => {
    const response = await DatabaseConnection.findNode('invalid')
    expect(response.success).toBeFalsy()
    done()
  })
})