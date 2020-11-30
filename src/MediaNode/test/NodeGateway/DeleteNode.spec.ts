import NodeGateway from '../../gateway/ImmutableTextNodeGateway';
import { INodeGateway, newFilePath } from "apposition-interfaces"
import ImmutableTextNodeGateway from '../../gateway/ImmutableTextNodeGateway';
import DatabaseConnection from '../../dbConfig';

describe('Unit Test: Get Node', () => {
  const nodeGateway = new ImmutableTextNodeGateway(DatabaseConnection)

  beforeEach(async done => {
    const response = await DatabaseConnection.clearNodeCollection()
    expect(response.success).toBeTruthy()

    const createResponse = await DatabaseConnection.initNodes([
      {
        nodeId: 'a',
        text: 'Test String 1.'
      },
      {
        nodeId: 'b',
        text: 'Test'
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