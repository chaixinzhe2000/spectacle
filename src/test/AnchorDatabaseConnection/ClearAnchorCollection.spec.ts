import DatabaseConnection from '../../dbConfig';

describe('Clear Collection', () => {
  test("clears collection", async done => {
    const response = await DatabaseConnection.clearAnchorCollection()
    expect(response.success).toBeTruthy()
    done()
  })
})