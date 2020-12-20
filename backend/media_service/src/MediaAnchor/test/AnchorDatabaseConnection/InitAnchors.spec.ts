import AnchorDatabaseConnection from '../../dbConfig';


describe('Init Testing Tree', () => {
  
  beforeAll(async done => {
    const response = await AnchorDatabaseConnection.clearAnchorCollection()
    expect(response.success).toBeTruthy()
    done()
  })

  test("inits nodes", async done => {
    const createResponse = await AnchorDatabaseConnection.initAnchors([
      {
        anchorId: 'a',
        mediaTimeStamp: 1
      },
      {
        anchorId: 'b',
        mediaTimeStamp: 2
      }
    ])
    expect(createResponse.success).toBeTruthy()
    done()
  })

  afterAll(async done => {
    const response = await AnchorDatabaseConnection.clearAnchorCollection()
    expect(response.success).toBeTruthy()
    done()
  })
})