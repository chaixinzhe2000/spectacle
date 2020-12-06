import DatabaseConnection from '../../dbConfig';

describe('Delete Nodes', () => {
	const docDbConnection = DatabaseConnection

	beforeAll(async done => {
		const response = await docDbConnection.clearNodeCollection()
		expect(response.success).toBeTruthy()
		done()

		const createResponse = await docDbConnection.initNodes([
			{
				nodeId: 'a',
				mediaUrl: "https://www.youtube.com/watch?v=kQqdf484iyc"
			},
			{
				nodeId: 'b',
				mediaUrl: "https://www.youtube.com/watch?v=kQqdf484iyc"
			}
		])
		expect(createResponse.success).toBeTruthy()
		done()
	})

	afterAll(async done => {
		const response = await docDbConnection.clearNodeCollection()
		expect(response.success).toBeTruthy()
		done()
	})

	test("deletes non-existent document", async done => {
		const response = await docDbConnection.deleteNode('a')
		expect(response.success).toBeTruthy()
		done()
	})

	test("deletes existent document", async done => {
		const response = await docDbConnection.deleteNode('c')
		expect(response.success).toBeTruthy()
		done()
	})
})