import AnchorDatabaseConnection from '../../dbConfig';

describe('Unit Test: Clear Anchor Collection', () => {
  test("clears anchor collection", async done => {
    const response = await AnchorDatabaseConnection.clearAnchorCollection()
    expect(response.success).toBeTruthy()
    done()
  })
})