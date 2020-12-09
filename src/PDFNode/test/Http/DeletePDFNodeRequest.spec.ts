import {
  IServiceResponse,
  isServiceResponse,
  IPDFNode,
} from "spectacle-interfaces";
import request from "supertest";
import app from "../../../app";
import DatabaseConnection from "../../dbConfig";

const service = "/pdf";

const testNode: IPDFNode = {
  nodeId: 'a',
  pdfUrl: "https://www.michigan.gov/documents/leo/Teaching_Through_Memes_PowerPoint_693511_7.pdf"
}
const testNode2: IPDFNode = {
  nodeId: 'b',
  pdfUrl: "https://www.michigan.gov/documents/leo/Teaching_Through_Memes_PowerPoint_693511_7.pdf"
}

const testNode3: IPDFNode = {
  nodeId: 'c',
  pdfUrl: "https://www.michigan.gov/documents/leo/Teaching_Through_Memes_PowerPoint_693511_7.pdf"
}


describe("Unit Test: Delete Node Request", () => {
  test("delete node by id", async (done) => {
    const clearResponse = await DatabaseConnection.clearNodeCollection();
    expect(clearResponse.success).toBeTruthy();

    const initResponse = await DatabaseConnection.initNodes([
      testNode,
      testNode2,
      testNode3,
    ]);
    expect(initResponse.success).toBeTruthy();

    const getResponse1 = await DatabaseConnection.findNode(testNode.nodeId);
    expect(getResponse1.success).toBeTruthy();
    expect(getResponse1.payload).toStrictEqual(testNode);

    const deleteResponse = await request(app)
      .delete(`${service}/${testNode.nodeId}`)
      .expect(200)
      .expect("Content-Type", /json/);
    expect(isServiceResponse(deleteResponse.body)).toBeTruthy();
    const sr: IServiceResponse<{}> = deleteResponse.body;
    expect(sr.success).toBeTruthy();

    const getResponse2 = await DatabaseConnection.findNode(testNode.nodeId);
    expect(getResponse2.success).toBeFalsy();

    const clearResponse2 = await DatabaseConnection.clearNodeCollection();
    expect(clearResponse2.success).toBeTruthy();
    done();
  });

  test("delete nodes by node id", async (done) => {
    const clearResponse = await DatabaseConnection.clearNodeCollection();
    expect(clearResponse.success).toBeTruthy();

    const initResponse = await DatabaseConnection.initNodes([
      testNode,
      testNode2,
      testNode3,
    ]);
    expect(initResponse.success).toBeTruthy();

    const getResponse1 = await DatabaseConnection.findNode(testNode.nodeId);
    expect(getResponse1.success).toBeTruthy();
    expect(getResponse1.payload).toStrictEqual(testNode);

    const getResponse2 = await DatabaseConnection.findNode(testNode2.nodeId);
    expect(getResponse2.success).toBeTruthy();
    expect(getResponse2.payload).toStrictEqual(testNode2);

    const getResponse3 = await DatabaseConnection.findNode(testNode3.nodeId);
    expect(getResponse3.success).toBeTruthy();
    expect(getResponse3.payload).toStrictEqual(testNode3);

    const deleteResponse = await request(app)
      .delete(
        `${service}/list/${[testNode.nodeId, testNode2.nodeId].join(",")}`
      )
      .expect(200)
      .expect("Content-Type", /json/);
    expect(isServiceResponse(deleteResponse.body)).toBeTruthy();
    const sr: IServiceResponse<{}> = deleteResponse.body;
    expect(sr.success).toBeTruthy();

    const getResponse4 = await DatabaseConnection.findNode(testNode.nodeId);
    expect(getResponse4.success).toBeFalsy();

    const getResponse6 = await DatabaseConnection.findNode(testNode2.nodeId);
    expect(getResponse6.success).toBeFalsy();

    const getResponse5 = await DatabaseConnection.findNode(testNode3.nodeId);
    expect(getResponse5.success).toBeTruthy();
    expect(getResponse5.payload).toStrictEqual(testNode3);

    const clearResponse2 = await DatabaseConnection.clearNodeCollection();
    expect(clearResponse2.success).toBeTruthy();
    done();
  });
});
