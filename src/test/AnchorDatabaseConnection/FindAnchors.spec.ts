import DatabaseConnection from '../../dbConfig';

describe('Find Anchors', () => {
  afterAll(async done => {
    const response = await DatabaseConnection.clearAnchorCollection()
    expect(response.success).toBeTruthy()
    done()
  })

  test("fails to find anchor in empty collection", async done => {
    const dresponse = await DatabaseConnection.clearAnchorCollection()
    expect(dresponse.success).toBeTruthy() 

    const response = await DatabaseConnection.findAnchors(['id3'])
    expect(response.success).toBeFalsy()
    done()
  })

  test("finds two anchors", async done => {
    const dresponse = await DatabaseConnection.clearAnchorCollection()
    expect(dresponse.success).toBeTruthy() 

    const createResponse = await DatabaseConnection.initAnchors([
      {
        nodeId: 'node.a',
        anchorId: 'anchor.a',
        label: 'label.a'
      },
      {
        nodeId: 'node.b',
        anchorId: 'anchor.b',
        label: 'label.b'
      }
    ])
    expect(createResponse.success).toBeTruthy()

    const response = await DatabaseConnection.findAnchors(['anchor.a', 'anchor.b'])
    expect(response.success).toBeTruthy()
    expect(Object.keys(response.payload).length).toBe(2)
    const anchors = response.payload
    expect(anchors['anchor.a'].anchorId).toBe('anchor.a')
    expect(anchors['anchor.a'].nodeId).toBe('node.a')
    expect(anchors['anchor.a'].label).toBe('label.a')
    expect(anchors['anchor.b'].anchorId).toBe('anchor.b')
    expect(anchors['anchor.b'].nodeId).toBe('node.b')
    expect(anchors['anchor.b'].label).toBe('label.b')

    const response2 = await DatabaseConnection.findAnchors(['anchor.a'])
    expect(response2.success).toBeTruthy()
    expect(Object.keys(response2.payload).length).toBe(1)
    const anchors2 = response.payload
    expect(anchors2['anchor.a'].anchorId).toBe('anchor.a')
    expect(anchors2['anchor.a'].nodeId).toBe('node.a')
    expect(anchors2['anchor.a'].label).toBe('label.a')
    done()
  })

  test("fails on null", async (done) => {
    const response = await DatabaseConnection.findAnchors(null);
    expect(response.success).toBeFalsy();
    done();
  });
})