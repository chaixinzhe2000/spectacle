import DatabaseConnection from "../../dbConfig";

describe("Delete Link", () => {
  const linkDbConnection = DatabaseConnection;

  beforeEach(async (done) => {
    const response = await linkDbConnection.clearLinkCollection();
    expect(response.success).toBeTruthy();
    done();

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

  test("deletes non-existent link", async (done) => {
    const response = await linkDbConnection.deleteLink("bad-id");
    expect(response.success).toBeTruthy();
    done();
  });

  test("deletes existent link", async (done) => {
    const response = await linkDbConnection.deleteLink("l2");
    expect(response.success).toBeTruthy();
    done();
  });

  test("fails on null", async (done) => {
    const response = await linkDbConnection.deleteLink(null);
    expect(response.success).toBeFalsy();
    done();
  });
});
