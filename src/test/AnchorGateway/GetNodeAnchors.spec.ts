import { IAnchorGateway } from 'hypertext-interfaces';
import DatabaseConnection from '../../dbConfig';
import AnchorGateway from '../../gateway/AnchorGateway';

describe('Unit Test: Get Node Anchors', () => {
  const anchorGateway: IAnchorGateway = new AnchorGateway(DatabaseConnection)

  beforeAll(async done => {
    const response = await DatabaseConnection.clearAnchorCollection()
    expect(response.success).toBeTruthy()

    const createResponse = await DatabaseConnection.initAnchors([
      {
        anchorId: 'a',
        nodeId: 'node.a',
        label: 'label.a'
      },
      {
        anchorId: 'b',
        nodeId: 'node.b',
        label: 'label.b'
      },
      {
        anchorId: 'c',
        nodeId: 'node.b',
        label: 'label.c'
      },
      {
        anchorId: 'd',
        nodeId: 'node.b',
        label: 'label.d'
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

  test("doesn't get non-existent anchor", async done => {
    const getResponse = await anchorGateway.getNodeAnchors('bad_id')
    expect(getResponse.success).toBeFalsy()
    done()
  })

  test("successfully gets anchors", async done => {
    const getResponse = await anchorGateway.getNodeAnchors('node.b')
    expect(getResponse.success).toBeTruthy()
    const anchors = getResponse.payload
    expect(Object.keys(anchors).length).toBe(3)
    expect(anchors['b'].anchorId).toBe('b')
    expect(anchors['b'].nodeId).toBe('node.b')
    expect(anchors['b'].label).toBe('label.b')
    expect(anchors['c'].anchorId).toBe('c')
    expect(anchors['c'].nodeId).toBe('node.b')
    expect(anchors['c'].label).toBe('label.c')
    expect(anchors['d'].anchorId).toBe('d')
    expect(anchors['d'].nodeId).toBe('node.b')
    expect(anchors['d'].label).toBe('label.d')
    done()
  })

  test("successfully gets anchor", async done => {
    const getResponse = await anchorGateway.getNodeAnchors('node.a')
    expect(getResponse.success).toBeTruthy()
    expect(Object.keys(getResponse.payload).length).toBe(1)
    expect(getResponse.payload['a'].anchorId).toBe('a')
    expect(getResponse.payload['a'].nodeId).toBe('node.a')
    done()
  })
})