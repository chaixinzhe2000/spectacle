import DatabaseConnection from '../../dbConfig';

describe('Delete Anchors', () => {  
  beforeEach(async done => {
    const response = await DatabaseConnection.clearAnchorCollection()
    expect(response.success).toBeTruthy()

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
      },
      {
        nodeId: 'node.b',
        anchorId: 'anchor.f',
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

  test("deletes non-existent anchors", async done => {
    const response = await DatabaseConnection.deleteAnchors(['anchor.c', 'anchor.d'])
    expect(response.success).toBeTruthy()
    done()
  })

  test("deletes 2 existent anchors", async done => {
    const response = await DatabaseConnection.deleteAnchors(['anchor.a', 'anchor.b'])
    expect(response.success).toBeTruthy()
    done()
  })

  test("deletes 1 existent anchor", async done => {
    const response = await DatabaseConnection.deleteAnchors(['anchor.f'])
    expect(response.success).toBeTruthy()
    done()
  })

  test("deletes 1 existent anchors even if other anchors don't exist", async done => {
    const response = await DatabaseConnection.deleteAnchors(['anchor.a', 'anchor.c'])
    expect(response.success).toBeTruthy()
    done()
  })

  test("fails on null", async (done) => {
    const response = await DatabaseConnection.deleteAnchors(null);
    expect(response.success).toBeFalsy();
    done();
  });
})