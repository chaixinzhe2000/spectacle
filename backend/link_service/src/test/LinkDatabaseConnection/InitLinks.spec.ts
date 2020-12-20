import DatabaseConnection from "../../dbConfig";

describe("Init Testing Tree", () => {
  const docDbConnection = DatabaseConnection;

  beforeAll(async (done) => {
    const response = await docDbConnection.clearLinkCollection();
    expect(response.success).toBeTruthy();
    done();
  });

  test("inits links", async (done) => {
    const createResponse = await docDbConnection.initLinks([
      {
        linkId: "l1",
        srcAnchorId: "a1",
        destAnchorId: "a2",
      },
      {
        linkId: "l2",
        srcAnchorId: "a2",
        destNodeId: "n1",
      },
    ]);
    expect(createResponse.success).toBeTruthy();
    done();
  });

  afterAll(async (done) => {
    const response = await docDbConnection.clearLinkCollection();
    expect(response.success).toBeTruthy();
    done();
  });
});
