import DatabaseConnection from '../../dbConfig';

describe('Find Anchors by Node', () => {
  afterAll(async done => {
    const response = await DatabaseConnection.clearAnchorCollection()
    expect(response.success).toBeTruthy()
    done()
  })

  test("fails to find anchor in empty collection", async done => {
    const dresponse = await DatabaseConnection.clearAnchorCollection()
    expect(dresponse.success).toBeTruthy()

    const response = await DatabaseConnection.findAnchorsByNode('node.a')
    expect(response.success).toBeFalsy()
    done()
  })

  test("finds one and two anchors by node", async done => {
    const dresponse = await DatabaseConnection.clearAnchorCollection()
    expect(dresponse.success).toBeTruthy() 

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
		content: "I like this a lot 1!",
		type: "media",
		createdAt: new Date()
      },
      {
        nodeId: 'node.b',
        anchorId: 'anchor.c',
		content: "I like this a lot 2!",
		type: "media",
		createdAt: new Date()
      }
    ])
    expect(createResponse.success).toBeTruthy()

    const response = await DatabaseConnection.findAnchorsByNode('node.a')
    expect(response.success).toBeTruthy()
    const anchors = response.payload
    expect(Object.keys(anchors).length).toBe(1)
    expect(anchors['anchor.a'].anchorId).toBe('anchor.a')
    expect(anchors['anchor.a'].nodeId).toBe('node.a')
    expect(anchors['anchor.a'].content).toBe("I like this a lot!")

    const response2 = await DatabaseConnection.findAnchorsByNode('node.b')
    expect(response2.success).toBeTruthy()
    expect(Object.keys(response2.payload).length).toBe(2)
    const anchors2 = response2.payload
    expect(anchors2['anchor.b'].anchorId).toBe('anchor.b')
    expect(anchors2['anchor.b'].nodeId).toBe('node.b')
    expect(anchors2['anchor.b'].content).toBe("I like this a lot 1!")
    expect(anchors2['anchor.c'].anchorId).toBe('anchor.c')
    expect(anchors2['anchor.c'].nodeId).toBe('node.b')
    expect(anchors2['anchor.c'].content).toBe('I like this a lot 2!')

    const response3 = await DatabaseConnection.findAnchorsByNode('node.c')
    expect(response3.success).toBeFalsy()
    done()
  })

  test("fails on null", async (done) => {
    const response = await DatabaseConnection.findAnchorsByNode(null);
    expect(response.success).toBeFalsy();
    done();
  });
})