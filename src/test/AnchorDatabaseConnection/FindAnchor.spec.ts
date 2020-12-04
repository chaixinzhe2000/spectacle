import DatabaseConnection from '../../dbConfig';

describe('Find Anchor', () => {
  afterAll(async done => {
    const response = await DatabaseConnection.clearAnchorCollection()
    expect(response.success).toBeTruthy()
    done()
  })

  test("finds anchor", async done => {
    const dResponse = await DatabaseConnection.clearAnchorCollection()
    expect(dResponse.success).toBeTruthy()

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
        content: "I don't like this at all!",
		type: "node",
		createdAt: new Date()
      }
    ])
    expect(createResponse.success).toBeTruthy()

    const response = await DatabaseConnection.findAnchor('anchor.a')
    expect(response.success).toBeTruthy()
    expect(response.payload.anchorId).toBe('anchor.a')
    expect(response.payload.nodeId).toBe('node.a')
	expect(response.payload.content).toBe("I like this a lot!")
	expect(response.payload.type).toBe("media")

	const response_b = await DatabaseConnection.findAnchor('anchor.b')
    expect(response_b.success).toBeTruthy()
    expect(response_b.payload.anchorId).toBe('anchor.b')
    expect(response_b.payload.nodeId).toBe('node.b')
	expect(response_b.payload.content).toBe("I don't like this at all!")
	expect(response_b.payload.type).toBe("node")
    done()
  })

  test("fails to find non-existent anchor", async done => {
    const response = await DatabaseConnection.findAnchor('invalid')
    expect(response.success).toBeFalsy()
    done()
  })

  test("fails on null", async (done) => {
    const response = await DatabaseConnection.findAnchor(null);
    expect(response.success).toBeFalsy();
    done();
  });
})