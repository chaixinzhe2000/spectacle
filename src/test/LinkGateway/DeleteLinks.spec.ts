import { ILinkGateway } from "hypertext-interfaces";
import DatabaseConnection from "../../dbConfig";
import LinkGateway from "../../gateway/LinkGateway";

describe("Unit Test: Delete Links", () => {
  const linkDbConnection = DatabaseConnection;
  const linkGateway: ILinkGateway = new LinkGateway(linkDbConnection);

  beforeEach(async (done) => {
    const response = await linkDbConnection.clearLinkCollection();
    expect(response.success).toBeTruthy();

    const createResponse = await linkDbConnection.initLinks([
      {
        linkId: "l1",
        srcAnchorId: "a1",
        destAnchorId: "a2",
        srcNodeId: "n1",
        destNodeId: "n2",
      },
      {
        linkId: "l2",
        srcAnchorId: "a2",
        destAnchorId: "a1",
        srcNodeId: "n2",
        destNodeId: "n1",
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

  test("deletes non-existent links", async (done) => {
    const deleteResponse = await linkGateway.deleteLinks(["bad_id", "bad_id2"]);
    expect(deleteResponse.success).toBeTruthy();
    const getResponse = await linkDbConnection.findLinks(["bad_id", "bad_id2"]);
    expect(getResponse.success).toBeFalsy();
    done();
  });

  test("successfully deletes multiple links", async (done) => {
    const getResponse = await linkDbConnection.findLinks(["l1", "l2"]);
    expect(getResponse.success).toBeTruthy();

    const deleteResponse = await linkGateway.deleteLinks(["l1", "l2"]);
    expect(deleteResponse.success).toBeTruthy();

    const findResponse2 = await linkDbConnection.findLinks(["l1", "l2"]);
    expect(findResponse2.success).toBeFalsy();

    done();
  });

  test("successfully deletes even with some invalid links", async (done) => {
    const findResponse = await linkDbConnection.findLinks(["l1", "l2"]);
    expect(findResponse.success).toBeTruthy();

    const deleteResponse = await linkGateway.deleteLinks(["l1", "bad_id"]);
    expect(deleteResponse.success).toBeTruthy();

    const findResponse2 = await linkDbConnection.findLinks(["l1", "bad_id"]);
    expect(findResponse2.success).toBeFalsy();

    const findResponse3 = await linkDbConnection.findLinks(["l2"]);
    expect(findResponse3.success).toBeTruthy();

    done();
  });
});
