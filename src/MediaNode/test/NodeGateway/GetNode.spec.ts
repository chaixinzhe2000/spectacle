import MediaNodeGateway from '../../gateway/NodeGateway';
import DatabaseConnection from '../../dbConfig';

describe('Unit Test: Get Node', () => {
  const nodeGateway = new MediaNodeGateway(DatabaseConnection)

  beforeAll(async done => {
    const response = await DatabaseConnection.clearNodeCollection()
    expect(response.success).toBeTruthy()

    const createResponse = await DatabaseConnection.initNodes([
      {
        nodeId: 'a',
        mediaUrl: "https://www.youtube.com/watch?v=kQqdf484iyc"
      },
      {
        nodeId: 'b',
        mediaUrl: "https://www.youtube.com/watch?v=kQqdf484iyc"
      }
    ])
    expect(createResponse.success).toBeTruthy()
    done()
  })

  test("doesn't get non-existent node", async done => {
    const getResponse = await nodeGateway.getNode('bad_id')
    expect(getResponse.success).toBeFalsy()
    done()
  })

  test("successfully gets node", async done => {
    const getResponse = await nodeGateway.getNode('a')
    expect(getResponse.success).toBeTruthy()
    expect(getResponse.payload.nodeId).toBe('a')
    expect(getResponse.payload.mediaUrl).toBe("https://www.youtube.com/watch?v=kQqdf484iyc")
    done()
  })

  test("successfully gets node and children", async done => {
    const getResponse = await nodeGateway.getNode('b')
    expect(getResponse.success).toBeTruthy()
    expect(getResponse.payload.nodeId).toBe('b')
    expect(getResponse.payload.mediaUrl).toBe("https://www.youtube.com/watch?v=kQqdf484iyc")
    done()
  })
})