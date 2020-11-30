import MediaAnchorGateway from '../../gateway/MediaAnchorGateway';
import { IMediaAnchorGateway, newFilePath } from "apposition-interfaces"
import AnchorDatabaseConnection from '../../dbConfig';

describe('Unit Test: Get Anchor', () => {
  const nodeGateway: IMediaAnchorGateway = new MediaAnchorGateway(AnchorDatabaseConnection)

  const anchor1 = {
    anchorId: 'a',
    mediaTimeStamp: 10
  }

  const anchor2 = {
    anchorId: 'b',
    mediaTimeStamp: 20
  }
  
  beforeAll(async done => {
    const response = await AnchorDatabaseConnection.clearAnchorCollection()
    expect(response.success).toBeTruthy()

    const createResponse = await AnchorDatabaseConnection.initAnchors([anchor1, anchor2])
    expect(createResponse.success).toBeTruthy()
    done()
  })

  test("doesn't get non-existent node", async done => {
    const getResponse = await nodeGateway.getAnchor('bad_id')
    expect(getResponse.success).toBeFalsy()
    done()
  })

  test("successfully gets node", async done => {
    const getResponse = await nodeGateway.getAnchor(anchor1.anchorId)
    expect(getResponse.success).toBeTruthy()
    expect(getResponse.payload).toStrictEqual(anchor1)
    done()
  })

  test("successfully gets node and children", async done => {
    const getResponse = await nodeGateway.getAnchor(anchor2.anchorId)
    expect(getResponse.success).toBeTruthy()
    expect(getResponse.payload).toStrictEqual(anchor2)
    done()
  })
})