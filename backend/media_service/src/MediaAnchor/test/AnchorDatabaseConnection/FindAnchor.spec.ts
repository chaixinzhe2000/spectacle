import AnchorDatabaseConnection from '../../dbConfig';

describe('Find Node', () => {

  test("finds node", async done => {
    const dResponse = await AnchorDatabaseConnection.clearAnchorCollection()
    expect(dResponse.success).toBeTruthy()

    const createResponse = await AnchorDatabaseConnection.initAnchors([
      {
        anchorId: 'a',
        mediaTimeStamp: 50
      },
      {
        anchorId: 'b',
        mediaTimeStamp: 100
      }
    ])
    expect(createResponse.success).toBeTruthy()

    const response = await AnchorDatabaseConnection.findAnchor('b')
    expect(response.success).toBeTruthy()
    expect(response.payload.anchorId).toBe('b')
    expect(response.payload.mediaTimeStamp).toBe(100)

    const response2 = await AnchorDatabaseConnection.findAnchor('a')
    expect(response2.success).toBeTruthy()
    expect(response2.payload.anchorId).toBe('a')
    expect(response2.payload.mediaTimeStamp).toBe(50)
    done()
  })

  test("fails to find non-existent node", async done => {
    const response = await AnchorDatabaseConnection.findAnchor('invalid')
    expect(response.success).toBeFalsy()
    done()
  })
})