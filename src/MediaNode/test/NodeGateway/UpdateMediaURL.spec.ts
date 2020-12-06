import MediaNodeGateway from '../../gateway/NodeGateway';
import { INodeGateway, newFilePath } from "spectacle-interfaces"
import DatabaseConnection from '../../dbConfig';

describe('Unit Test: updateMediaUrl', () => {
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

  test("successfully updates with valid media url", async done => {
    const updateResponse = await nodeGateway.updateNode('a', 'https://www.youtube.com/watch?v=RvhpncC5jZ8&ab_channel=LexFridman')
    expect(updateResponse.success).toBeTruthy()
    const findResponse = await nodeGateway.getNode('a')
    expect(findResponse.payload.mediaUrl).toBe("https://www.youtube.com/watch?v=RvhpncC5jZ8&ab_channel=LexFridman")
    done()
  })


})