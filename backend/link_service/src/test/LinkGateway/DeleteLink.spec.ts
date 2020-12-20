import { ILinkGateway } from "spectacle-interfaces";
import DatabaseConnection from "../../dbConfig";
import LinkGateway from "../../gateway/LinkGateway";

describe("Unit Test: Delete Link", () => {
  const linkDbConnection = DatabaseConnection;
  const linkGateway: ILinkGateway = new LinkGateway(linkDbConnection);

  beforeEach(async (done) => {
    const response = await linkDbConnection.clearLinkCollection();
    expect(response.success).toBeTruthy();

    const createResponse = await linkDbConnection.initLinks([
      {
        linkId: "l1",
        srcAnchorId: "a1",
        destAnchorId: "a2"
      },
      {
        linkId: "l2",
        srcAnchorId: "n1",
        destAnchorId: "n2"
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

  test("deletes non-existent link", async (done) => {
    const deleteResponse = await linkGateway.deleteLink("bad_id");
    expect(deleteResponse.success).toBeTruthy();
    const getResponse = await linkDbConnection.findLink("bad_id");
    expect(getResponse.success).toBeFalsy();
    done();
  });

  test("successfully deletes existing link", async (done) => {
    const findResponse = await linkDbConnection.findLink("l1");
    expect(findResponse.success).toBeTruthy();

    const deleteResponse = await linkGateway.deleteLink("l1");
    expect(deleteResponse.success).toBeTruthy();

    const findResponse2 = await linkDbConnection.findLink("l1");
    expect(findResponse2.success).toBeFalsy();
    done();
  });
});
