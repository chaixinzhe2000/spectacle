import PDFNodeGateway from '../../gateway/NodeGateway';
import DatabaseConnection from '../../dbConfig';

describe('Unit Test: Get Node', () => {
  const nodeGateway = new PDFNodeGateway(DatabaseConnection)

  beforeAll(async done => {
    const response = await DatabaseConnection.clearNodeCollection()
    expect(response.success).toBeTruthy()

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
    expect(getResponse.payload.pdfUrl).toBe("https://www.michigan.gov/documents/leo/Teaching_Through_Memes_PowerPoint_693511_7.pdf")
    done()
  })

  test("successfully gets node and children", async done => {
    const getResponse = await nodeGateway.getNode('b')
    expect(getResponse.success).toBeTruthy()
    expect(getResponse.payload.nodeId).toBe('b')
    expect(getResponse.payload.pdfUrl).toBe("https://www.michigan.gov/documents/leo/Teaching_Through_Memes_PowerPoint_693511_7.pdf")
    done()
  })
})