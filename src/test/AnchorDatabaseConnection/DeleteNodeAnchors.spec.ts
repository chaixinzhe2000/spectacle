import DatabaseConnection from '../../dbConfig';

describe('Delete Node Anchors', () => {  
  beforeAll(async done => {
    const response = await DatabaseConnection.clearAnchorCollection()
    expect(response.success).toBeTruthy()

    const createResponse = await DatabaseConnection.initAnchors([
      {
        nodeId: 'node.a',
        anchorId: 'anchor.a',
        contentList: ["I like this a lot!", "great job"],
		authorList: ["Xinzhe Chai", "Jinoo"],
		type: "media",
		createdAt: new Date()
      },
      {
        nodeId: 'node.b',
        anchorId: 'anchor.b',
        contentList: ["I like this a lot!", "great job"],
		authorList: ["Xinzhe Chai", "Jinoo"],
		type: "media",
		createdAt: new Date()
      },
      {
        nodeId: 'node.b',
        anchorId: 'anchor.f',
        contentList: ["I like this a lot!", "great job"],
		authorList: ["Xinzhe Chai", "Jinoo"],
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
    const response = await DatabaseConnection.deleteAnchorsByNode('node.c')
    expect(response.success).toBeTruthy()
    done()
  })

  test("deletes 1 existent anchors", async done => {
    const response = await DatabaseConnection.deleteAnchorsByNode('node.a')
    expect(response.success).toBeTruthy()
    done()
  })

  test("deletes 2 existent anchor", async done => {
    const response = await DatabaseConnection.deleteAnchorsByNode('node.b')
    expect(response.success).toBeTruthy()
    done()
  })

  test("fails on null", async (done) => {
    const response = await DatabaseConnection.deleteAnchorsByNode(null);
    expect(response.success).toBeFalsy();
    done();
  });
})