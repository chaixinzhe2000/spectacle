import MediaAnchorGateway from '../../gateway/MediaAnchorGateway';
import AnchorDatabaseConnection from '../../dbConfig';
import { IMediaAnchorGateway } from 'apposition-interfaces';

describe('Unit Test: Get Anchor', () => {
  const anchorGateway: IMediaAnchorGateway = new MediaAnchorGateway(AnchorDatabaseConnection)

  beforeEach(async done => {
    const response = await AnchorDatabaseConnection.clearAnchorCollection()
    expect(response.success).toBeTruthy()

    const createResponse = await AnchorDatabaseConnection.initAnchors([
      {
        anchorId: 'a',
        mediaTimeStamp: 10
      },
      {
        anchorId: 'b',
        mediaTimeStamp: 20
      }
    ])
    expect(createResponse.success).toBeTruthy()
    done()
  })

  test("deletes non-existent anchor", async done => {
    const deleteResponse = await anchorGateway.deleteAnchor('bad_id')
    expect(deleteResponse.success).toBeTruthy()
    done()
  })

  test("successfully deletes existing anchor", async done => {
    
    const findResponse = await AnchorDatabaseConnection.findAnchor('a')
    expect(findResponse.success).toBeTruthy()

    const deleteResponse = await anchorGateway.deleteAnchor('a')
    expect(deleteResponse.success).toBeTruthy()
    
    const findResponse2 = await AnchorDatabaseConnection.findAnchor('a')
    expect(findResponse2.success).toBeFalsy()
    done()
  })
})