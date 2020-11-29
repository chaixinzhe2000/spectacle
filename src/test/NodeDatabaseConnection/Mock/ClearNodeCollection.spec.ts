import MockMongoDatabaseConnection from '../../../database/mongo/mock/MockMongoNodeDatabaseConnection';

describe('Unit Test: Create Node', () => {
  const docDbConnection = new MockMongoDatabaseConnection()
  
  test("clears document collection", async done => {
    const response = await docDbConnection.clearNodeCollection()
    expect(response.success).toBeTruthy()
    done()
  })
})