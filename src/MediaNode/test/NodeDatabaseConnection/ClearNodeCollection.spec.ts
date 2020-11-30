import DatabaseConnection from '../../dbConfig';

describe('Unit Test: Create Node', () => {
  const docDbConnection = DatabaseConnection
  
  test("clears document collection", async done => {
    const response = await docDbConnection.clearNodeCollection()
    expect(response.success).toBeTruthy()
    done()
  })
})