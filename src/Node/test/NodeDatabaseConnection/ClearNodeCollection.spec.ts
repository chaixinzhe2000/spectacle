import DatabaseConnection from "../../dbConfig";

describe("Unit Test: Clear Node Collection", () => {
  const docDbConnection = DatabaseConnection;

  test("clears node collection", async (done) => {
    const response = await docDbConnection.clearNodeCollection();
    expect(response.success).toBeTruthy();
    done();
  });
});
