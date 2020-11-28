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
        label: 'label.a'
      },
      {
        nodeId: 'node.b',
        anchorId: 'anchor.b',
        label: 'label'
      }
    ])
    expect(createResponse.success).toBeTruthy()

    const response = await DatabaseConnection.findAnchor('anchor.a')
    expect(response.success).toBeTruthy()
    expect(response.payload.anchorId).toBe('anchor.a')
    expect(response.payload.nodeId).toBe('node.a')
    expect(response.payload.label).toBe('label.a')
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