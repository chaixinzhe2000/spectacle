import DatabaseConnection from "../../dbConfig";

describe("Find Links by Anchor", () => {
  const linkDbConnection = DatabaseConnection;

  afterAll(async (done) => {
    const response = await linkDbConnection.clearLinkCollection();
    expect(response.success).toBeTruthy();
    done();
  });

  test("fails to find link in empty collection", async (done) => {
    const dresponse = await linkDbConnection.clearLinkCollection();
    expect(dresponse.success).toBeTruthy();

    const response = await linkDbConnection.findLinksByAnchor("a1");
    expect(response.success).toBeFalsy();
    done();
  });

  test("finds links by anchor", async (done) => {
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
        destAnchorId: "a3",
        srcNodeId: "n2",
        destNodeId: "n3",
      },
    ]);
    expect(createResponse.success).toBeTruthy();

    const response = await linkDbConnection.findLinksByAnchor("a1");
    expect(response.success).toBeTruthy();
    expect(Object.keys(response.payload).length).toBe(1);
    expect(response.payload["l1"].linkId).toBe("l1");
    expect(response.payload["l1"].srcAnchorId).toBe("a1");
    expect(response.payload["l1"].destAnchorId).toBe("a2");
    expect(response.payload["l1"].srcNodeId).toBe("n1");
    expect(response.payload["l1"].destNodeId).toBe("n2");
    expect(response.payload["l2"]).toBe(undefined);

    const response2 = await linkDbConnection.findLinksByAnchor("a2");
    expect(response2.success).toBeTruthy();
    expect(Object.keys(response2.payload).length).toBe(2);
    expect(response2.payload["l1"].linkId).toBe("l1");
    expect(response2.payload["l1"].srcAnchorId).toBe("a1");
    expect(response2.payload["l1"].destAnchorId).toBe("a2");
    expect(response2.payload["l1"].srcNodeId).toBe("n1");
    expect(response2.payload["l1"].destNodeId).toBe("n2");
    expect(response2.payload["l2"].linkId).toBe("l2");
    expect(response2.payload["l2"].srcAnchorId).toBe("a2");
    expect(response2.payload["l2"].destAnchorId).toBe("a3");
    expect(response2.payload["l2"].srcNodeId).toBe("n2");
    expect(response2.payload["l2"].destNodeId).toBe("n3");

    const response3 = await linkDbConnection.findLinksByAnchor("a4");
    expect(response3.success).toBeFalsy();
    done();
  });

  test("fails on null", async (done) => {
    const response = await linkDbConnection.findLinksByAnchor(null);
    expect(response.success).toBeFalsy();
    done();
  });
});
