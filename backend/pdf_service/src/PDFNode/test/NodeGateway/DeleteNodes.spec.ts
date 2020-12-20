import DatabaseConnection from "../../dbConfig";
import PDFNodeGateway from "../../gateway/NodeGateway";

describe("Unit Test: Get Node", () => {
  const nodeGateway = new PDFNodeGateway(DatabaseConnection);

  beforeEach(async (done) => {
    const response = await DatabaseConnection.clearNodeCollection();
    expect(response.success).toBeTruthy();

    const createResponse = await DatabaseConnection.initNodes([
      {
        nodeId: 'a',
        pdfUrl: "https://www.michigan.gov/documents/leo/Teaching_Through_Memes_PowerPoint_693511_7.pdf"
      },
      {
        nodeId: 'b',
        pdfUrl: "https://www.michigan.gov/documents/leo/Teaching_Through_Memes_PowerPoint_693511_7.pdf"
      },
      {
        nodeId: 'c',
        pdfUrl: "https://www.michigan.gov/documents/leo/Teaching_Through_Memes_PowerPoint_693511_7.pdf"
      }
    ]);
    expect(createResponse.success).toBeTruthy();
    done();
  });

  test("deletes non-existent node", async (done) => {
    const deleteResponse = await nodeGateway.deleteNodes(["bad_id"]);
    expect(deleteResponse.success).toBeTruthy();
    done();
  });

  test("successfully deletes 2 existing nodes", async (done) => {
    const findResponse = await DatabaseConnection.findNode("a");
    expect(findResponse.success).toBeTruthy();

    const findResponse2 = await DatabaseConnection.findNode("b");
    expect(findResponse2.success).toBeTruthy();

    const deleteResponse = await nodeGateway.deleteNodes(["a", "b"]);
    expect(deleteResponse.success).toBeTruthy();

    const findResponse3 = await DatabaseConnection.findNode("a");
    expect(findResponse3.success).toBeFalsy();

    const findResponse4 = await DatabaseConnection.findNode("b");
    expect(findResponse4.success).toBeFalsy();
    done();
  });

  test("successfully deletes existing and non-existent node", async (done) => {
    const findResponse = await DatabaseConnection.findNode("c");
    expect(findResponse.success).toBeTruthy();

    const findResponse2 = await DatabaseConnection.findNode("d");
    expect(findResponse2.success).toBeFalsy();

    const deleteResponse = await nodeGateway.deleteNodes(["c", "d"]);
    expect(deleteResponse.success).toBeTruthy();

    const findResponse3 = await DatabaseConnection.findNode("c");
    expect(findResponse3.success).toBeFalsy();

    const findResponse4 = await DatabaseConnection.findNode("d");
    expect(findResponse4.success).toBeFalsy();
    done();
  });
});
