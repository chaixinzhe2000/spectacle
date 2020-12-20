import DatabaseConnection from '../../dbConfig';

describe('Updates Nodes Media URL', () => {
	const docDbConnection = DatabaseConnection

	afterAll(async done => {
		const response = await docDbConnection.clearNodeCollection()
		expect(response.success).toBeTruthy()
		done()
	})

	beforeAll(async done => {
		const dresponse = await docDbConnection.clearNodeCollection()
		expect(dresponse.success).toBeTruthy()
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

	test("updating valid url", async done => {
		const response = await docDbConnection.updateMediaURL('a', "https://www.youtube.com/watch?v=idontwantodo1951v")
		expect(response.success).toBeTruthy()
		expect(Object.keys(response.payload).length).toBe(2)
		const response2 = await docDbConnection.findNodes(['a'])
		expect(response2.success).toBeTruthy()
		expect(Object.keys(response2.payload).length).toBe(1)
		expect(response2.payload['a'].mediaUrl).toEqual("https://www.youtube.com/watch?v=idontwantodo1951v")
		done()
	})

	test("fails to update invalid url", async done => {
		const response = await docDbConnection.updateMediaURL('b', "idontwantodo1951v")
		expect(response.success).toBeFalsy()
		const response2 = await docDbConnection.findNodes(['b'])
		expect(response2.success).toBeTruthy()
		expect(Object.keys(response2.payload).length).toBe(1)
		expect(response2.payload['b'].mediaUrl).toEqual("https://www.youtube.com/watch?v=kQqdf484iyc")
		done()
	})
})