import DatabaseConnection from "../../dbConfig";

describe("Delete Nodes", () => {
  beforeAll(async (done) => {
    const response = await DatabaseConnection.clearNodeCollection();
    expect(response.success).toBeTruthy();

    const createResponse = await DatabaseConnection.initNodes([
      {
        nodeId: 'a',
        text: 'Test String 1.'
      },
      {
        nodeId: 'b',
        text: 'Test'
      },
      {
        nodeId: 'c',
        text: 'Test'
      }
    ]);
    expect(createResponse.success).toBeTruthy();
    done();
  });

  afterAll(async (done) => {
    const response = await DatabaseConnection.clearNodeCollection();
    expect(response.success).toBeTruthy();
    done();
  });

  test("deletes existent node", async (done) => {
    const response = await DatabaseConnection.deleteNodes(["a", "b"]);
    expect(response.success).toBeTruthy();
    done();
  });

  test("deletes non-existent nodes", async (done) => {
    const response = await DatabaseConnection.deleteNodes(["d", "f"]);
    expect(response.success).toBeTruthy();
    done();
  });

  test("deletes node and non-existent noe", async (done) => {
    const response = await DatabaseConnection.deleteNodes(["c", "f"]);
    expect(response.success).toBeTruthy();
    done();
  });
});
