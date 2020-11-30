import { IMediaAnchor, IMediaAnchorGateway } from 'apposition-interfaces';
import DatabaseConnection from '../../dbConfig';
import MediaAnchorGateway from '../../gateway/MediaAnchorGateway';

describe('Unit Test: Create Anchor', () => {
  const anchorGateway: IMediaAnchorGateway = new MediaAnchorGateway(DatabaseConnection)

  beforeAll(async done => {
    const response = await DatabaseConnection.clearAnchorCollection()
    expect(response.success).toBeTruthy()
    done()
  })
  
  test("doesn't create invalid anchor", async done => {
    const findResponse = await DatabaseConnection.findAnchor('id')
    expect(findResponse.success).toBeFalsy()

    const badanchor: any = { 'id': 'id' }
	const response = await anchorGateway.createAnchor(badanchor)
    expect(response.success).toBeFalsy()

    const findResponse2 = await DatabaseConnection.findAnchor('id')
    expect(findResponse2.success).toBeFalsy()
    done()
  })

  test("creates valid anchor", async done => {
    const validanchor: IMediaAnchor = {
      anchorId: 'id',
      mediaTimeStamp: 10
    }

    const findResponse = await DatabaseConnection.findAnchor(validanchor.anchorId)
    expect(findResponse.success).toBeFalsy()

    const response = await anchorGateway.createAnchor(validanchor)
    expect(response.success).toBeTruthy()

    const findResponse2 = await DatabaseConnection.findAnchor(validanchor.anchorId)
    expect(findResponse2.success).toBeTruthy()
    expect(findResponse2.payload).toStrictEqual(validanchor)
    done()
  })

  test("creates valid anchor, fails to create valid anchor with same id", async done => {
    const validanchor: IMediaAnchor = {
      anchorId: 'id2',
      mediaTimeStamp: 20
    }

    const findResponse = await DatabaseConnection.findAnchor(validanchor.anchorId)
    expect(findResponse.success).toBeFalsy()

    const response = await anchorGateway.createAnchor(validanchor)
    expect(response.success).toBeTruthy()

    const findResponse2 = await DatabaseConnection.findAnchor(validanchor.anchorId)
    expect(findResponse2.success).toBeTruthy()
    expect(findResponse2.payload).toStrictEqual(validanchor)

    const validanchor2: IMediaAnchor = {
      anchorId: 'id2',
      mediaTimeStamp: 30
    }
    const response2 = await anchorGateway.createAnchor(validanchor2)
    expect(response2.success).toBeFalsy()

    const findResponse3 = await DatabaseConnection.findAnchor(validanchor.anchorId)
    expect(findResponse3.success).toBeTruthy()
    expect(findResponse3.payload).toStrictEqual(validanchor)
    done()
  })

  test("fails to create mediaTimeStamp is null", async done => {
    const invalidanchor: any = {
      anchorId: 'id4',
      mediaTimeStamp: null
    }
    const response = await anchorGateway.createAnchor(invalidanchor)
    expect(response.success).toBeFalsy()

    const findResponse = await DatabaseConnection.findAnchor(invalidanchor.anchorId)
	expect(findResponse.success).toBeFalsy()
	done()
  })

  test("fails to create anchor when mediaTimeStamp is string", async done => {
    const invalidanchor: any = {
      anchorId: 'id4',
      mediaTimeStamp: '20a'
    }
    const response = await anchorGateway.createAnchor(invalidanchor)
    expect(response.success).toBeFalsy()

    const findResponse = await DatabaseConnection.findAnchor(invalidanchor.anchorId)
    expect(findResponse.success).toBeFalsy()
    done()
  })
})