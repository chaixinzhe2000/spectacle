import DatabaseConnection from "../../dbConfig";

describe("Delete Links", () => {
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

  test("deletes non-existent links", async (done) => {
    const response = await linkDbConnection.deleteLinks([
      "invalid1",
      "invalid2",
    ]);
    expect(response.success).toBeTruthy();
    done();
  });

  test("deletes multiple existent links", async (done) => {
    const response = await linkDbConnection.deleteLinks(["l1", "l2"]);
    expect(response.success).toBeTruthy();
    done();
  });

  test("deletes one existent and one non-existent", async (done) => {
    const response = await linkDbConnection.deleteLinks(["l2", "l3"]);
    expect(response.success).toBeTruthy();
    done();
  });

  test("deletes 1 existent link", async (done) => {
    const response = await linkDbConnection.deleteLinks(["l2"]);
    expect(response.success).toBeTruthy();
    done();
  });

  test("deletes empty array of links", async (done) => {
    const response = await linkDbConnection.deleteLinks([]);
    expect(response.success).toBeTruthy();
    done();
  });

  test("fails on null", async (done) => {
    const response = await linkDbConnection.deleteLinks(null);
    expect(response.success).toBeFalsy();
    done();
  });
});
