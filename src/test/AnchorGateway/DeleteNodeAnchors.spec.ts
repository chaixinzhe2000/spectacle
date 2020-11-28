import { IAnchorGateway } from 'hypertext-interfaces';
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
        label: 'label'
      },
      {
        anchorId: 'b',
        nodeId: 'node.b',
        label: 'label'
      },
      {
        anchorId: 'c',
        nodeId: 'node.b',
        label: 'label'
      },
      {
        anchorId: 'd',
        nodeId: 'node.b',
        label: 'label'
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

  test("successfully deletes anchor", async done => {
    const getRespoonse = await DatabaseConnection.findAnchorsByNode('node.b')
    expect(getRespoonse.success).toBeTruthy()

    const deleteResponse = await anchorGateway.deleteNodeAnchors('node.b')
    expect(deleteResponse.success).toBeTruthy()

    const getRespoonse2 = await DatabaseConnection.findAnchorsByNode('node.b')
    expect(getRespoonse2.success).toBeFalsy()
    done()
  })

  test("successfully deletes anchor and children", async done => {
    const getRespoonse = await DatabaseConnection.findAnchorsByNode('node.a')
    expect(getRespoonse.success).toBeTruthy()

    const getRespoonse2 = await DatabaseConnection.findAnchor('a')
    expect(getRespoonse2.success).toBeTruthy()

    const deleteResponse = await anchorGateway.deleteNodeAnchors('node.a')
    expect(deleteResponse.success).toBeTruthy()

    const getRespoonse3 = await DatabaseConnection.findAnchorsByNode('node.a')
    expect(getRespoonse3.success).toBeFalsy()

    const getRespoonse4 = await DatabaseConnection.findAnchor('a')
    expect(getRespoonse4.success).toBeFalsy()
    done()
  })
})