import DatabaseConnection from "../../dbConfig";

describe("Delete Node Links", () => {
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

  test("deletes non-existent links", async (done) => {
    const response = await linkDbConnection.deleteNodeLinks("n5");
    expect(response.success).toBeTruthy();
    done();
  });

  test("deletes 1 existent node link", async (done) => {
    const response = await linkDbConnection.deleteNodeLinks("n1");
    expect(response.success).toBeTruthy();
    done();
  });

  test("deletes 2 existent node links", async (done) => {
    const response = await linkDbConnection.deleteNodeLinks("n2");
    expect(response.success).toBeTruthy();
    done();
  });

  test("fails on null", async (done) => {
      const response = await linkDbConnection.deleteNodeLinks(null);
      expect(response.success).toBeFalsy();
      done();
    });
});
