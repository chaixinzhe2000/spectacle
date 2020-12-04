import DatabaseConnection from '../../dbConfig';

describe('Init Anchors', () => {  
  beforeAll(async done => {
    const response = await DatabaseConnection.clearAnchorCollection()
    expect(response.success).toBeTruthy()
    done()
  })

  test("inits anchors", async done => {
    const createResponse = await DatabaseConnection.initAnchors([
      {
        nodeId: 'node.a',
        anchorId: 'anchor.a',
        content: "I like this a lot!",
		type: "media",
		createdAt: new Date()
      },
      {
        nodeId: 'node.b',
        anchorId: 'anchor.b',
        content: "I like this a lot!",
		type: "media",
		createdAt: new Date()
      }
    ])
    expect(createResponse.success).toBeTruthy()
    done()
  })

  afterAll(async done => {
    const response = await DatabaseConnection.clearAnchorCollection()
    expect(response.success).toBeTruthy()
    done()
  })
})