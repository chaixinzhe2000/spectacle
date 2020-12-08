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
				pdfUrl: "https://www.michigan.gov/documents/leo/Teaching_Through_Memes_PowerPoint_693511_7.pdf"
			},
			{
				nodeId: 'b',
				pdfUrl: "https://www.michigan.gov/documents/leo/Teaching_Through_Memes_PowerPoint_693511_7.pdf"
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