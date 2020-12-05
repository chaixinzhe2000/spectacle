import { ILinkGateway } from "spectacle-interfaces";
import DatabaseConnection from "../../dbConfig";
import LinkGateway from "../../gateway/LinkGateway";

describe("Unit Test: Get Link", () => {
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
    ]);
    expect(createResponse.success).toBeTruthy();
    done();
  });

  afterAll(async (done) => {
    const response = await linkDbConnection.clearLinkCollection();
    expect(response.success).toBeTruthy();
    done();
  });

  test("doesn't get non-existent link", async (done) => {
    const getResponse = await linkGateway.getLink("bad_id");
    expect(getResponse.success).toBeFalsy();
    done();
  });

  test("successfully gets link 1", async (done) => {
    const getResponse = await linkGateway.getLink("l1");
    expect(getResponse.success).toBeTruthy();
    expect(getResponse.payload.linkId).toBe("l1");
    expect(getResponse.payload.srcAnchorId).toBe("a1");
    expect(getResponse.payload.destAnchorId).toBe("a2");
    expect(getResponse.payload.srcNodeId).toBe("n1");
    expect(getResponse.payload.destNodeId).toBe("n2");
    done();
  });

  test("successfully gets link 2", async (done) => {
    const getResponse = await linkGateway.getLink("l2");
    expect(getResponse.success).toBeTruthy();
    expect(getResponse.payload.linkId).toBe("l2");
    expect(getResponse.payload.srcAnchorId).toBe("a2");
    expect(getResponse.payload.destAnchorId).toBe("a1");
    expect(getResponse.payload.srcNodeId).toBe("n2");
    expect(getResponse.payload.destNodeId).toBe("n1");
    done();
  });
});
