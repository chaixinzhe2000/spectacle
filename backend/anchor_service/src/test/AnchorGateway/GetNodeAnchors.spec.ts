import { IAnchorGateway } from 'spectacle-interfaces';
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
    expect(anchors['b'].contentList).toEqual(["content B"])
    expect(anchors['b'].authorList).toEqual(["author B"])
    expect(anchors['c'].anchorId).toBe('c')
    expect(anchors['c'].nodeId).toBe('node.b')
    expect(anchors['c'].contentList).toEqual(["content C"])
    expect(anchors['c'].authorList).toEqual(["author C"])
    expect(anchors['d'].anchorId).toBe('d')
    expect(anchors['d'].nodeId).toBe('node.b')
    expect(anchors['d'].contentList).toEqual(["content D"])
    expect(anchors['d'].authorList).toEqual(["author D"])
    done()
  })

  test("successfully gets anchor", async done => {
    const getResponse = await anchorGateway.getNodeAnchors('node.a')
    expect(getResponse.success).toBeTruthy()
    expect(Object.keys(getResponse.payload).length).toBe(1)
    expect(getResponse.payload['a'].anchorId).toBe('a')
    expect(getResponse.payload['a'].nodeId).toBe('node.a')
    expect(getResponse.payload['a'].contentList).toEqual(["content A"])
    expect(getResponse.payload['a'].authorList).toEqual(["author A"])
    done()
  })
})