import DatabaseConnection from "../../dbConfig";

describe("Find Links", () => {
  const linkDbConnection = DatabaseConnection;

  afterAll(async (done) => {
    const response = await linkDbConnection.clearLinkCollection();
    expect(response.success).toBeTruthy();
    done();
  });

  test("fails to find link with empty collection", async (done) => {
    const dresponse = await linkDbConnection.clearLinkCollection();
    expect(dresponse.success).toBeTruthy();

    const response = await linkDbConnection.findLinks(["l1"]);
    expect(response.success).toBeFalsy();
    done();
  });

  test("finds links", async (done) => {
    const dresponse = await linkDbConnection.clearLinkCollection();
    expect(dresponse.success).toBeTruthy();

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

    const response = await linkDbConnection.findLinks(["l1", "l2"]);
    expect(response.success).toBeTruthy();
    expect(Object.keys(response.payload).length).toBe(2);
    expect(response.payload["l1"].linkId).toBe("l1");
    expect(response.payload["l1"].srcAnchorId).toBe("a1");
    expect(response.payload["l1"].destAnchorId).toBe("a2");
    expect(response.payload["l1"].srcNodeId).toBe("n1");
    expect(response.payload["l1"].destNodeId).toBe("n2");
    expect(response.payload["l2"].linkId).toBe("l2");
    expect(response.payload["l2"].srcAnchorId).toBe("a2");
    expect(response.payload["l2"].destAnchorId).toBe("a1");
    expect(response.payload["l2"].srcNodeId).toBe("n2");
    expect(response.payload["l2"].destNodeId).toBe("n1");

    const response2 = await linkDbConnection.findLinks(["l1"]);
    expect(response2.success).toBeTruthy();
    expect(Object.keys(response2.payload).length).toBe(1);
    expect(response2.payload["l1"].linkId).toBe("l1");
    expect(response2.payload["l1"].srcAnchorId).toBe("a1");
    expect(response2.payload["l1"].destAnchorId).toBe("a2");
    expect(response2.payload["l1"].srcNodeId).toBe("n1");
    expect(response2.payload["l1"].destNodeId).toBe("n2");
    expect(response2.payload["l2"]).toBe(undefined);

    const response3 = await linkDbConnection.findLinks([]);
    expect(response3.success).toBeFalsy();
    done();
  });

  test("finds only valid links in list", async (done) => {
    const dresponse = await linkDbConnection.clearLinkCollection();
    expect(dresponse.success).toBeTruthy();

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

    const response = await linkDbConnection.findLinks(["l1", "l2", "l3"]);
    expect(response.success).toBeTruthy();
    expect(Object.keys(response.payload).length).toBe(2);
    expect(response.payload["l1"].linkId).toBe("l1");
    expect(response.payload["l1"].srcAnchorId).toBe("a1");
    expect(response.payload["l1"].destAnchorId).toBe("a2");
    expect(response.payload["l1"].srcNodeId).toBe("n1");
    expect(response.payload["l1"].destNodeId).toBe("n2");
    expect(response.payload["l2"].linkId).toBe("l2");
    expect(response.payload["l2"].srcAnchorId).toBe("a2");
    expect(response.payload["l2"].destAnchorId).toBe("a1");
    expect(response.payload["l2"].srcNodeId).toBe("n2");
    expect(response.payload["l2"].destNodeId).toBe("n1");
    expect(response.payload["l3"]).toBe(undefined);

    done();
  });

  test("fails on null", async (done) => {
    const response = await linkDbConnection.findLinks(null);
    expect(response.success).toBeFalsy();
    done();
  });
});
