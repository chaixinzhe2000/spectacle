import DatabaseConnection from "../../dbConfig";

describe("Clear Link Collection", () => {
  const linkDbConnection = DatabaseConnection;

  test("clears document collection", async (done) => {
    const response = await linkDbConnection.clearLinkCollection();
    expect(response.success).toBeTruthy();
    done();
  });
});
