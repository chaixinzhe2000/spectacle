import DatabaseConnection from "../../dbConfig";

describe("Find Links by Node", () => {
  const linkDbConnection = DatabaseConnection;

  afterAll(async (done) => {
    const response = await linkDbConnection.clearLinkCollection();
    expect(response.success).toBeTruthy();
    done();
  });

  test("fails to find link in empty collection", async (done) => {
    const dresponse = await linkDbConnection.clearLinkCollection();
    expect(dresponse.success).toBeTruthy();

    const response = await linkDbConnection.findLinksByNode("l1");
    expect(response.success).toBeFalsy();
    done();
  });

  test("finds links by node", async (done) => {
    const dresponse = await linkDbConnection.clearLinkCollection();
    expect(dresponse.success).toBeTruthy();

    const createResponse = await linkDbConnection.initLinks([
      {
        linkId: "l1",
        srcNodeId: "n1",
        destNodeId: "n2",
      },
      {
        linkId: "l2",
        srcAnchorId: "a2",
        srcNodeId: "n2",
      },
    ]);
    expect(createResponse.success).toBeTruthy();

    const response = await linkDbConnection.findLinksByNode("n1");
    expect(response.success).toBeTruthy();
    expect(Object.keys(response.payload).length).toBe(1);
    expect(response.payload["l1"].linkId).toBe("l1");
    expect(response.payload["l1"].srcAnchorId).toBe(null);
    expect(response.payload["l1"].destAnchorId).toBe(null);
    expect(response.payload["l1"].srcNodeId).toBe("n1");
    expect(response.payload["l1"].destNodeId).toBe("n2");
    expect(response.payload["l2"]).toBe(undefined);

    const response2 = await linkDbConnection.findLinksByNode("n2");
    expect(response2.success).toBeTruthy();
    expect(Object.keys(response2.payload).length).toBe(2);
    expect(response2.payload["l1"].linkId).toBe("l1");
    expect(response2.payload["l1"].srcAnchorId).toBe(null);
    expect(response2.payload["l1"].destAnchorId).toBe(null);
    expect(response2.payload["l1"].srcNodeId).toBe("n1");
    expect(response2.payload["l1"].destNodeId).toBe("n2");
    expect(response2.payload["l2"].linkId).toBe("l2");
    expect(response2.payload["l2"].srcAnchorId).toBe("a2");
    expect(response2.payload["l2"].destAnchorId).toBe(null);
    expect(response2.payload["l2"].srcNodeId).toBe("n2");
    expect(response2.payload["l2"].destNodeId).toBe(null);

    const response3 = await linkDbConnection.findLinksByNode("n4");
    expect(response3.success).toBeFalsy();
    done();
  });

  test("fails on null", async (done) => {
    const response = await linkDbConnection.findLinksByNode(null);
    expect(response.success).toBeFalsy();
    done();
  });
});
