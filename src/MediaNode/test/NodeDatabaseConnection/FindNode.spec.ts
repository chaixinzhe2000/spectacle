import DatabaseConnection from '../../dbConfig';

describe('Find Node', () => {

  test("finds node", async done => {
    const dResponse = await DatabaseConnection.clearNodeCollection()
    expect(dResponse.success).toBeTruthy()

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

    const response = await DatabaseConnection.findNode('b')
    expect(response.success).toBeTruthy()
    expect(response.payload.nodeId).toBe('b')
    expect(response.payload.text).toBe('Test')
    done()
  })

  test("fails to find non-existent node", async done => {
    const response = await DatabaseConnection.findNode('invalid')
    expect(response.success).toBeFalsy()
    done()
  })
})