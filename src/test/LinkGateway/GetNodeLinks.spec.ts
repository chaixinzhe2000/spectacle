import { ILinkGateway } from "spectacle-interfaces";
import DatabaseConnection from "../../dbConfig";
import LinkGateway from "../../gateway/LinkGateway";

describe("Unit Test: Get Node Links", () => {
  const linkDbConnection = DatabaseConnection;
  const linkGateway: ILinkGateway = new LinkGateway(linkDbConnection);

  beforeAll(async (done) => {
    const response = await linkDbConnection.clearLinkCollection();
    expect(response.success).toBeTruthy();

    const createResponse = await linkDbConnection.initLinks([
      {
        linkId: "l1",
        srcNodeId: "n1",
        destNodeId: "n2",
      },
      {
        linkId: "l2",
        srcNodeId: "n2",
        destNodeId: "n1",
      },
      {
        linkId: "l3",
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

  test("doesn't get links of non-existent node", async (done) => {
    const getResponse = await linkGateway.getNodeLinks("bad_node_id");
    expect(getResponse.success).toBeFalsy();
    done();
  });

  test("gets correct links of node", async (done) => {
    const getResponse = await linkGateway.getNodeLinks("n1");
    expect(getResponse.success).toBeTruthy();
    expect(Object.keys(getResponse.payload).length).toBe(2);
    expect(getResponse.payload["l1"].srcAnchorId).toBe(null);
    expect(getResponse.payload["l1"].destAnchorId).toBe(null);
    expect(getResponse.payload["l1"].srcNodeId).toBe("n1");
    expect(getResponse.payload["l1"].destNodeId).toBe("n2");
    expect(getResponse.payload["l2"].linkId).toBe("l2");
    expect(getResponse.payload["l2"].srcAnchorId).toBe(null);
    expect(getResponse.payload["l2"].destAnchorId).toBe(null);
    expect(getResponse.payload["l2"].srcNodeId).toBe("n2");
    expect(getResponse.payload["l2"].destNodeId).toBe("n1");
    expect(getResponse.payload["l3"]).toBe(undefined);
    done();
  });
});
