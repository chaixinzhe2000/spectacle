import { ILinkGateway } from "spectacle-interfaces";
import DatabaseConnection from "../../dbConfig";
import LinkGateway from "../../gateway/LinkGateway";

describe("Unit Test: Get Links", () => {
  const linkDbConnection = DatabaseConnection;
  const linkGateway: ILinkGateway = new LinkGateway(linkDbConnection);

  beforeAll(async (done) => {
    const response = await linkDbConnection.clearLinkCollection();
    expect(response.success).toBeTruthy();

    const createResponse = await linkDbConnection.initLinks([
      {
        linkId: "l1",
        srcAnchorId: "a1",
        destAnchorId: "a2",
      },
      {
        linkId: "l2",
        srcNodeId: "n1",
        destNodeId: "n2",
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

  test("doesn't get non-existent links", async (done) => {
    const getResponse = await linkGateway.getLinks(["bad_id", "bad_id2"]);
    expect(getResponse.success).toBeFalsy();
    done();
  });

  test("successfully gets multiple links", async (done) => {
    const getResponse = await linkGateway.getLinks(["l1", "l2"]);
    expect(getResponse.success).toBeTruthy();
    expect(Object.keys(getResponse.payload).length).toBe(2);
    expect(getResponse.payload["l1"].linkId).toBe("l1");
    expect(getResponse.payload["l1"].srcAnchorId).toBe("a1");
    expect(getResponse.payload["l1"].destAnchorId).toBe("a2");
    expect(getResponse.payload["l1"].srcNodeId).toBe(null);
    expect(getResponse.payload["l1"].destNodeId).toBe(null);
    expect(getResponse.payload["l2"].linkId).toBe("l2");
    expect(getResponse.payload["l2"].srcAnchorId).toBe(null);
    expect(getResponse.payload["l2"].destAnchorId).toBe(null);
    expect(getResponse.payload["l2"].srcNodeId).toBe("n1");
    expect(getResponse.payload["l2"].destNodeId).toBe("n2");
    const getResponse2 = await linkGateway.getLinks(["l1"]);
    expect(getResponse2.success).toBeTruthy();
    expect(Object.keys(getResponse2.payload).length).toBe(1);
    expect(getResponse2.payload["l1"].linkId).toBe("l1");
    expect(getResponse2.payload["l1"].srcAnchorId).toBe("a1");
    expect(getResponse2.payload["l1"].destAnchorId).toBe("a2");
    expect(getResponse2.payload["l1"].srcNodeId).toBe(null);
    expect(getResponse2.payload["l1"].destNodeId).toBe(null);
    expect(getResponse2.payload["l2"]).toBe(undefined);
    done();
  });

  test("only returns the valid links that were given", async (done) => {
    const getResponse = await linkGateway.getLinks(["l1", "l2", "bad_id"]);
    expect(getResponse.success).toBeTruthy();
    expect(Object.keys(getResponse.payload).length).toBe(2);
    expect(getResponse.payload["l1"].linkId).toBe("l1");
    expect(getResponse.payload["l1"].srcAnchorId).toBe("a1");
    expect(getResponse.payload["l1"].destAnchorId).toBe("a2");
    expect(getResponse.payload["l1"].srcNodeId).toBe(null);
    expect(getResponse.payload["l1"].destNodeId).toBe(null);
    expect(getResponse.payload["l2"].linkId).toBe("l2");
    expect(getResponse.payload["l2"].srcAnchorId).toBe(null);
    expect(getResponse.payload["l2"].destAnchorId).toBe(null);
    expect(getResponse.payload["l2"].srcNodeId).toBe("n1");
    expect(getResponse.payload["l2"].destNodeId).toBe("n2");
    expect(getResponse.payload["bad_id"]).toBe(undefined);
    done();
  });
});
