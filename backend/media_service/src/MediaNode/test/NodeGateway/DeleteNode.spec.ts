import MediaNodeGateway from '../../gateway/NodeGateway';
import { INodeGateway, newFilePath } from "spectacle-interfaces"
import DatabaseConnection from '../../dbConfig';

describe('Unit Test: Get Node', () => {
  const nodeGateway = new MediaNodeGateway(DatabaseConnection)

  beforeEach(async done => {
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

  test("deletes non-existent node", async done => {
    const deleteResponse = await nodeGateway.deleteNode('bad_id')
    expect(deleteResponse.success).toBeTruthy()
    done()
  })

  test("successfully deletes existing node", async done => {
    
    const findResponse = await DatabaseConnection.findNode('a')
    expect(findResponse.success).toBeTruthy()

    const deleteResponse = await nodeGateway.deleteNode('a')
    expect(deleteResponse.success).toBeTruthy()
    
    const findResponse2 = await DatabaseConnection.findNode('a')
    expect(findResponse2.success).toBeFalsy()
    done()
  })
})