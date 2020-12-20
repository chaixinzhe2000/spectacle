import MediaAnchorGateway from '../../gateway/MediaAnchorGateway';
import AnchorDatabaseConnection from '../../dbConfig';
import { IMediaAnchorGateway } from 'spectacle-interfaces';

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

  test("deletes non-existent node", async done => {
    const deleteResponse = await anchorGateway.deleteAnchors(['bad_id'])
    expect(deleteResponse.success).toBeTruthy()
    done()
  })

  test("successfully deletes existing node", async done => {
    
    const findResponse = await AnchorDatabaseConnection.findAnchor('a')
    expect(findResponse.success).toBeTruthy()

    const findResponse1 = await AnchorDatabaseConnection.findAnchor('b')
    expect(findResponse1.success).toBeTruthy()

    const deleteResponse = await anchorGateway.deleteAnchors(['a', 'b'])
    expect(deleteResponse.success).toBeTruthy() 
    
    const findResponse2 = await AnchorDatabaseConnection.findAnchor('a')
    expect(findResponse2.success).toBeFalsy()

    const findResponse3 = await AnchorDatabaseConnection.findAnchor('b')
    expect(findResponse3.success).toBeFalsy()
    done()
  })
})