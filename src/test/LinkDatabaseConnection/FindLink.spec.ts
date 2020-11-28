import DatabaseConnection from "../../dbConfig";

describe("Find Link", () => {
  const linkDbConnection = DatabaseConnection;
  test("finds link", async (done) => {
    const dResponse = await linkDbConnection.clearLinkCollection();
    expect(dResponse.success).toBeTruthy();

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

    const response = await linkDbConnection.findLink("l1");
    expect(response.success).toBeTruthy();
    expect(response.payload.linkId).toBe("l1");
    expect(response.payload.srcAnchorId).toBe("a1");
    expect(response.payload.destAnchorId).toBe("a2");
    expect(response.payload.srcNodeId).toBe("n1");
    expect(response.payload.destNodeId).toBe("n2");
    done();
  });

  test("fails to find non-existent link", async (done) => {
    const response = await linkDbConnection.findLink("invalid");
    expect(response.success).toBeFalsy();
    const dresponse = await linkDbConnection.clearLinkCollection();
    expect(dresponse.success).toBeTruthy();
    done();
  });

  test("fails on null", async (done) => {
    const response = await linkDbConnection.findLink(null);
    expect(response.success).toBeFalsy();
    done();
  });
});
