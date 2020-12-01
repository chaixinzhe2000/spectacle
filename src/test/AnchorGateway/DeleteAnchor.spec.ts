import { IAnchorGateway } from 'spectacle-interfaces';
import DatabaseConnection from '../../dbConfig';
import AnchorGateway from '../../gateway/AnchorGateway';

describe('Unit Test: Delete anchor', () => {
  const anchorGateway: IAnchorGateway = new AnchorGateway(DatabaseConnection)

  beforeEach(async done => {
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
        nodeId: 'node.a',
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

  test("deletes non-existent anchor", async done => {
    const deleteResponse = await anchorGateway.deleteAnchor('bad_id')
    expect(deleteResponse.success).toBeTruthy()
    done()
  })

  test("successfully deletes existing anchor", async done => {
    
    const findResponse = await DatabaseConnection.findAnchor('a')
    expect(findResponse.success).toBeTruthy()

    const deleteResponse = await anchorGateway.deleteAnchor('a')
    expect(deleteResponse.success).toBeTruthy()
    
    const findResponse2 = await DatabaseConnection.findAnchor('a')
    expect(findResponse2.success).toBeFalsy()
    done()
  })
})