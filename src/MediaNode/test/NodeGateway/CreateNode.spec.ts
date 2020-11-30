import DatabaseConnection from '../../dbConfig';
import { createNode, IImmutableTextNode, newFilePath } from "apposition-interfaces"
import ImmutableTextNodeGateway from '../../gateway/ImmutableTextNodeGateway';

describe('Unit Test: Create Node', () => {
  const nodeGateway = new ImmutableTextNodeGateway(DatabaseConnection)

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
    const validnode: IImmutableTextNode = {
      nodeId: 'id',
      text: 'Lorem Ispis'
    }
    const response = await nodeGateway.createNode(validnode)
    expect(response.success).toBeTruthy()
    done()
  })

  test("creates valid node, fails to create valid node with same id", async done => {
    const validnode: IImmutableTextNode ={
      nodeId: 'id2',
      text: 'Lorem Ispisdsafdsa'
    }
    const response = await nodeGateway.createNode(validnode)
    expect(response.success).toBeTruthy()

    const validnode2: IImmutableTextNode = {
      nodeId: 'id2',
      text: 'Lorem Ispis'
    }
    const response2 = await nodeGateway.createNode(validnode2)
    expect(response2.success).toBeFalsy()
    done()
  })

  test("fails to create when text is null", async done => {
    const invalidnode: any = {
      nodeId: 'id4',
      text: null
    }
    const response = await nodeGateway.createNode(invalidnode)
    expect(response.success).toBeFalsy()
    done()
  })

  test("succeeds to create node when text is number", async done => {
    const invalidnode: any = {
      nodeId: 'id4',
      text: 5
    }
    const response = await nodeGateway.createNode(invalidnode)
    expect(response.success).toBeFalsy()
    done()
  })
})