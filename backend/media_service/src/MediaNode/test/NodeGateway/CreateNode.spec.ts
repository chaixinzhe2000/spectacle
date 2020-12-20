import DatabaseConnection from '../../dbConfig';
import { createNode, IMediaNode, newFilePath } from "spectacle-interfaces"
import MediaNodeGateway from '../../gateway/NodeGateway';

describe('Unit Test: Create Node', () => {
  const nodeGateway = new MediaNodeGateway(DatabaseConnection)

  beforeAll(async done => {
    const response = await DatabaseConnection.clearNodeCollection()
    expect(response.success).toBeTruthy()
    done()
  })
  
  test("doesn't create invalid node", async done => {
    const badnode: any = { 'id': 'id' }
    const response = await nodeGateway.createNode(badnode)
    expect(response.success).toBeFalsy()
    done()
  })

  test("creates valid node", async done => {
    const validnode: IMediaNode = {
      nodeId: 'id',
      mediaUrl: "https://www.youtube.com/watch?v=kQqdf484iyc"
    }
    const response = await nodeGateway.createNode(validnode)
    expect(response.success).toBeTruthy()
    done()
  })

  test("creates valid node, fails to create valid node with same id", async done => {
    const validnode: IMediaNode ={
      nodeId: 'id2',
      mediaUrl: "https://www.youtube.com/watch?v=kQqdf484iyc"
    }
    const response = await nodeGateway.createNode(validnode)
    expect(response.success).toBeTruthy()

    const validnode2: IMediaNode = {
      nodeId: 'id2',
      mediaUrl: "https://www.youtube.com/watch?v=kQqdf484iyc"
    }
    const response2 = await nodeGateway.createNode(validnode2)
    expect(response2.success).toBeFalsy()
    done()
  })

  test("fails to create when mediaUrl is null", async done => {
    const invalidnode: any = {
      nodeId: 'id4',
      mediaUrl: null
    }
    const response = await nodeGateway.createNode(invalidnode)
    expect(response.success).toBeFalsy()
    done()
  })

  test("succeeds to create node when mediaUrl is number", async done => {
    const invalidnode: any = {
      nodeId: 'id4',
      mediaUrl: 5
    }
    const response = await nodeGateway.createNode(invalidnode)
    expect(response.success).toBeFalsy()
    done()
  })
})