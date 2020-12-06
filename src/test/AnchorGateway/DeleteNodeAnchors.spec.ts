import { IAnchorGateway } from 'spectacle-interfaces';
import DatabaseConnection from '../../dbConfig';
import AnchorGateway from '../../gateway/AnchorGateway';

describe('Unit Test: Delete Anchors by Node', () => {
  const anchorGateway: IAnchorGateway = new AnchorGateway(DatabaseConnection)

  beforeAll(async done => {
    const response = await DatabaseConnection.clearAnchorCollection()
    expect(response.success).toBeTruthy()

    const createResponse = await DatabaseConnection.initAnchors([
      {
        anchorId: 'a',
        nodeId: 'node.a',
        contentList: ["content A"],
        authorList: ["author A"],
		type: "media",
		createdAt: new Date()
      },
      {
        anchorId: 'b',
        nodeId: 'node.b',
        contentList: ["content B"],
        authorList: ["author B"],
		type: "media",
		createdAt: new Date()
      },
      {
        anchorId: 'c',
        nodeId: 'node.b',
        contentList: ["content C"],
        authorList: ["author C"],
		type: "media",
		createdAt: new Date()
      },
      {
        anchorId: 'd',
        nodeId: 'node.b',
        contentList: ["content D"],
        authorList: ["author D"],
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

  test("deletes non-existent node", async done => {
    const deleteResponse = await anchorGateway.deleteNodeAnchors('bad_id')
    expect(deleteResponse.success).toBeTruthy()
    done()
  })

  test("successfully deletes anchors related to node", async done => {
    const getRespoonse = await anchorGateway.getNodeAnchors('node.b')
    expect(getRespoonse.success).toBeTruthy()

    const deleteResponse = await anchorGateway.deleteNodeAnchors('node.b')
    expect(deleteResponse.success).toBeTruthy()

    const getRespoonse2 = await anchorGateway.getNodeAnchors('node.b')
    expect(getRespoonse2.success).toBeFalsy()
    done()
  })

  test("successfully deletes anchor and children", async done => {
    const getRespoonse = await anchorGateway.getNodeAnchors('node.a')
    expect(getRespoonse.success).toBeTruthy()

    const getRespoonse2 = await anchorGateway.getAnchor('a')
    expect(getRespoonse2.success).toBeTruthy()

    const deleteResponse = await anchorGateway.deleteNodeAnchors('node.a')
    expect(deleteResponse.success).toBeTruthy()

    const getRespoonse3 = await anchorGateway.getNodeAnchors('node.a')
    expect(getRespoonse3.success).toBeFalsy()

    const getRespoonse4 = await anchorGateway.getAnchor('a')
    expect(getRespoonse4.success).toBeFalsy()
    done()
  })
})