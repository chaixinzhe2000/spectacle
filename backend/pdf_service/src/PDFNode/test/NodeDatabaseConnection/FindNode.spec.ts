import DatabaseConnection from '../../dbConfig';

describe('Find Node', () => {

  test("finds node", async done => {
    const dResponse = await DatabaseConnection.clearNodeCollection()
    expect(dResponse.success).toBeTruthy()

    const createResponse = await DatabaseConnection.initNodes([
      {
        nodeId: 'a',
        pdfUrl: "https://www.michigan.gov/documents/leo/Teaching_Through_Memes_PowerPoint_693511_7.pdf"
      },
      {
        nodeId: 'b',
        pdfUrl: "https://www.michigan.gov/documents/leo/Teaching_Through_Memes_PowerPoint_693511_7.pdf"
      }
    ])
    expect(createResponse.success).toBeTruthy()

    const response = await DatabaseConnection.findNode('b')
    expect(response.success).toBeTruthy()
    expect(response.payload.nodeId).toBe('b')
    expect(response.payload.pdfUrl).toBe("https://www.michigan.gov/documents/leo/Teaching_Through_Memes_PowerPoint_693511_7.pdf")
    done()
  })

  test("fails to find non-existent node", async done => {
    const response = await DatabaseConnection.findNode('invalid')
    expect(response.success).toBeFalsy()
    done()
  })
})