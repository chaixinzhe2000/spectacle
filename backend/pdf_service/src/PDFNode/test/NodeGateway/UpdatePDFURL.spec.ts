import PDFNodeGateway from '../../gateway/NodeGateway';
import { INodeGateway, newFilePath } from "spectacle-interfaces"
import DatabaseConnection from '../../dbConfig';

describe('Unit Test: updatePDFUrl', () => {
  const nodeGateway = new PDFNodeGateway(DatabaseConnection)

  beforeEach(async done => {
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

  test("successfully updates with valid pdf url", async done => {
    const updateResponse = await nodeGateway.updateNode('a', 'https://www.michigan.gov/documents/leo/Teaching_Through_Memes_PowerPoint_693511_7.pdf')
    expect(updateResponse.success).toBeTruthy()
    const findResponse = await nodeGateway.getNode('a')
    expect(findResponse.payload.pdfUrl).toBe("https://www.michigan.gov/documents/leo/Teaching_Through_Memes_PowerPoint_693511_7.pdf")
    done()
  })

  test("fails to update with url with invalid format", async done => {
    const updateResponse = await nodeGateway.updateNode('a', 'www.michigan.gov/documents/leo/Teaching_Through_Memes_PowerPoint_693511_7.pf')
    expect(updateResponse.success).toBeFalsy()
    done()
  })

})