import DatabaseConnection from '../../dbConfig';
import { createNode, IPDFNode, newFilePath } from "spectacle-interfaces"
import PDFNodeGateway from '../../gateway/NodeGateway';

describe('Unit Test: Create Node', () => {
  const nodeGateway = new PDFNodeGateway(DatabaseConnection)

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
    const validnode: IPDFNode = {
      nodeId: 'id',
      pdfUrl: "https://www.michigan.gov/documents/leo/Teaching_Through_Memes_PowerPoint_693511_7.pdf"
    }
    const response = await nodeGateway.createNode(validnode)
    expect(response.success).toBeTruthy()
    done()
  })

  test("creates valid node, fails to create valid node with same id", async done => {
    const validnode: IPDFNode ={
      nodeId: 'id2',
      pdfUrl: "https://www.michigan.gov/documents/leo/Teaching_Through_Memes_PowerPoint_693511_7.pdf"
    }
    const response = await nodeGateway.createNode(validnode)
    expect(response.success).toBeTruthy()

    const validnode2: IPDFNode = {
      nodeId: 'id2',
      pdfUrl: "https://www.michigan.gov/documents/leo/Teaching_Through_Memes_PowerPoint_693511_7.pdf"
    }
    const response2 = await nodeGateway.createNode(validnode2)
    expect(response2.success).toBeFalsy()
    done()
  })

  test("fails to create when pdfUrl is null", async done => {
    const invalidnode: any = {
      nodeId: 'id4',
      pdfUrl: null
    }
    const response = await nodeGateway.createNode(invalidnode)
    expect(response.success).toBeFalsy()
    done()
  })

  test("succeeds to create node when pdfUrl is number", async done => {
    const invalidnode: any = {
      nodeId: 'id4',
      pdfUrl: 5
    }
    const response = await nodeGateway.createNode(invalidnode)
    expect(response.success).toBeFalsy()
    done()
  })
})