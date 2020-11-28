import { ILinkGateway } from "hypertext-interfaces";
import DatabaseConnection from "../../dbConfig";
import LinkGateway from "../../gateway/LinkGateway";

describe("Get Anchor Links", () => {
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
      {
        linkId: "l3",
        srcAnchorId: "a3",
        destAnchorId: "a4",
        srcNodeId: "n3",
        destNodeId: "n3",
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

  test("doesn't get links of non-existent anchor", async (done) => {
    const getResponse = await linkGateway.getAnchorLinks("bad_anchor_id");
    expect(getResponse.success).toBeFalsy();
    done();
  });

  test("gets correct links of anchor", async (done) => {
    const getResponse = await linkGateway.getAnchorLinks("a1");
    expect(getResponse.success).toBeTruthy();
    expect(getResponse.payload["l1"].srcAnchorId).toBe("a1");
    expect(getResponse.payload["l1"].destAnchorId).toBe("a2");
    expect(getResponse.payload["l1"].srcNodeId).toBe("n1");
    expect(getResponse.payload["l1"].destNodeId).toBe("n2");
    expect(getResponse.payload["l2"].linkId).toBe("l2");
    expect(getResponse.payload["l2"].srcAnchorId).toBe("a2");
    expect(getResponse.payload["l2"].destAnchorId).toBe("a1");
    expect(getResponse.payload["l2"].srcNodeId).toBe("n2");
    expect(getResponse.payload["l2"].destNodeId).toBe("n1");
    expect(getResponse.payload["l3"]).toBe(undefined);
    done();
  });
});
