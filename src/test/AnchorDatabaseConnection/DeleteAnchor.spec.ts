import DatabaseConnection from '../../dbConfig';

describe('Delete Anchor', () => {  
  beforeAll(async done => {
    const response = await DatabaseConnection.clearAnchorCollection()
    expect(response.success).toBeTruthy()

    const createResponse = await DatabaseConnection.initAnchors([
      {
        nodeId: 'node.a',
        anchorId: 'anchor.a',
        label: 'a'
      },
      {
        nodeId: 'node.b',
        anchorId: 'anchor.b',
        label: 'b'
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

  test("deletes non-existent anchor", async done => {
    const response = await DatabaseConnection.deleteAnchor('anchor.c')
    expect(response.success).toBeTruthy()
    done()
  })

  test("deletes existent anchor", async done => {
    const response = await DatabaseConnection.deleteAnchor('anchor.a')
    expect(response.success).toBeTruthy()
    done()
  })

  test("fails on null", async (done) => {
    const response = await DatabaseConnection.deleteAnchor(null);
    expect(response.success).toBeFalsy();
    done();
  });
})