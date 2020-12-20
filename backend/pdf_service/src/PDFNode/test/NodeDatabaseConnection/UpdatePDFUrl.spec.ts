import DatabaseConnection from '../../dbConfig';

describe('Updates Nodes pdf URL', () => {
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
				pdfUrl: "https://www.michigan.gov/documents/leo/Teaching_Through_Memes_PowerPoint_693511_7.pdf"
			},
			{
				nodeId: 'b',
				pdfUrl: "http://i3dsymposium.github.io/2019/keynotes/I3D2019_keynote_AndyVanDam.pdf"
			}
		])
		expect(createResponse.success).toBeTruthy()
		done()
	})

	test("updating valid url", async done => {
		const response = await docDbConnection.updatePDFURL('a', "https://www.coutts.com/content/dam/rbs-coutts/coutts-com/Files/insights/general-insights/Coutts%20-%20The%2070%20best%20films%20of%20all%20time.pdf")
		expect(response.success).toBeTruthy()
		expect(Object.keys(response.payload).length).toBe(2)
		const response2 = await docDbConnection.findNodes(['a'])
		expect(response2.success).toBeTruthy()
		expect(Object.keys(response2.payload).length).toBe(1)
		expect(response2.payload['a'].pdfUrl).toEqual("https://www.coutts.com/content/dam/rbs-coutts/coutts-com/Files/insights/general-insights/Coutts%20-%20The%2070%20best%20films%20of%20all%20time.pdf")
		done()
	})

	test("fails to update invalid url", async done => {
		const response = await docDbConnection.updatePDFURL('b', "idontwantodo1951v.pf")
		expect(response.success).toBeFalsy()
		const response2 = await docDbConnection.findNodes(['b'])
		expect(response2.success).toBeTruthy()
		expect(Object.keys(response2.payload).length).toBe(1)
		expect(response2.payload['b'].pdfUrl).toEqual("http://i3dsymposium.github.io/2019/keynotes/I3D2019_keynote_AndyVanDam.pdf")
		done()
	})
})