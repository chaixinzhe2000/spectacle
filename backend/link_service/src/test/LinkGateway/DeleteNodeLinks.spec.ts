import { ILinkGateway } from "spectacle-interfaces";
import DatabaseConnection from "../../dbConfig";
import LinkGateway from "../../gateway/LinkGateway";

describe("Unit Test: Delete Node Links", () => {
  const linkDbConnection = DatabaseConnection;
  const linkGateway: ILinkGateway = new LinkGateway(linkDbConnection);

  beforeEach(async (done) => {
    const response = await linkDbConnection.clearLinkCollection();
    expect(response.success).toBeTruthy();

    const createResponse = await linkDbConnection.initLinks([
      {
        linkId: "l1",
        srcNodeId: "n1",
        destNodeId: "n2"
      },
      {
        linkId: "l2",
        srcNodeId: "n2",
        destNodeId: "n3"
      },
    ]);
    expect(createResponse.success).toBeTruthy();
    done();
  });

  afterAll(async (done) => {
    const response = await linkDbConnection.clearLinkCollection();
    expect(response.success).toBeTruthy();
    done();
  });

  test("deletes non-existent node", async (done) => {
    const deleteResponse = await linkGateway.deleteNodeLinks("bad_id");
    expect(deleteResponse.success).toBeTruthy();
    done();
  });

  test("successfully deletes nodes with given link", async (done) => {
    const getResponse = await DatabaseConnection.findLinksByNode("n2");
    expect(getResponse.success).toBeTruthy();

    const deleteResponse = await linkGateway.deleteNodeLinks("n2");
    expect(deleteResponse.success).toBeTruthy();

    const getResponse2 = await DatabaseConnection.findLinksByNode("n2");
    expect(getResponse2.success).toBeFalsy();

    const getResponse3 = await DatabaseConnection.findLink("l1");
    expect(getResponse3.success).toBeFalsy();

    const getResponse4 = await DatabaseConnection.findLink("l2");
    expect(getResponse4.success).toBeFalsy();
    done();
  });

  test("only deletes link of given node", async (done) => {
    const getResponse = await DatabaseConnection.findLinksByNode("n1");
    expect(getResponse.success).toBeTruthy();

    const deleteResponse = await linkGateway.deleteNodeLinks("n1");
    expect(deleteResponse.success).toBeTruthy();

    const getResponse2 = await DatabaseConnection.findLinksByNode("n1");
    expect(getResponse2.success).toBeFalsy();

    const getResponse3 = await DatabaseConnection.findLink("l1");
    expect(getResponse3.success).toBeFalsy();

    const getResponse4 = await DatabaseConnection.findLink("l2");
    expect(getResponse4.success).toBeTruthy();
    done();
  });
});
