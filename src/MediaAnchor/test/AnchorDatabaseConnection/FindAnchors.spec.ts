import { IMediaAnchor } from 'apposition-interfaces';
import AnchorDatabaseConnection from '../../dbConfig';


const anchor1: IMediaAnchor = {
  anchorId: 'a',
  mediaTimeStamp: 1
}

const anchor2: IMediaAnchor = {
  anchorId: 'b',
  mediaTimeStamp: 2
}

const anchor3: IMediaAnchor = {
  anchorId: 'c',
  mediaTimeStamp: 3
}


describe('Find anchors', () => {

  beforeAll(async done => {
    const response = await AnchorDatabaseConnection.clearAnchorCollection()
    expect(response.success).toBeTruthy()

    const createResponse = await AnchorDatabaseConnection.initAnchors([
      anchor1, anchor2, anchor3
    ])
    expect(createResponse.success).toBeTruthy()
    done()
  })

  afterAll(async done => {
    const response = await AnchorDatabaseConnection.clearAnchorCollection()
    expect(response.success).toBeTruthy()
    done()
  })


  test("finds anchors", async done => {
    const response = await AnchorDatabaseConnection.findAnchors(['a'])
    expect(response.success).toBeTruthy()
    expect(Object.keys(response.payload).length).toBe(1)
    const anchors = response.payload
    expect(anchors['a']).toStrictEqual(anchor1)
    done()
  })

  test("finds anchors", async done => {
    const response = await AnchorDatabaseConnection.findAnchors(['a', 'b', 'c'])
    expect(response.success).toBeTruthy()
    expect(Object.keys(response.payload).length).toBe(3)
    const anchors = response.payload
    expect(anchors['a']).toStrictEqual(anchor1)
    expect(anchors['b']).toStrictEqual(anchor2)
    expect(anchors['c']).toStrictEqual(anchor3)
    done()
  })

  test("finds anchors with some non-existent", async done => {
    const response = await AnchorDatabaseConnection.findAnchors(['a', 'd', 'c'])
    expect(response.success).toBeTruthy()
    expect(Object.keys(response.payload).length).toBe(2)
    const anchors = response.payload
    expect(anchors['a']).toStrictEqual(anchor1)
    expect(anchors['c']).toStrictEqual(anchor3)
    done()
  })

  test("fails to find non-existent anchor", async done => {
    const response = await AnchorDatabaseConnection.findAnchors(['invalid'])
    expect(response.success).toBeFalsy()
    done()
  })
})