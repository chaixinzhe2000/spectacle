import DatabaseConnection from '../../dbConfig';

describe('Add new annotation', () => {
	afterAll(async done => {
		const response = await DatabaseConnection.clearAnchorCollection()
		expect(response.success).toBeTruthy()
		done()
	})

	test("finds two anchors and change their contents respectively", async done => {
		const dresponse = await DatabaseConnection.clearAnchorCollection()
		expect(dresponse.success).toBeTruthy()

		const createResponse = await DatabaseConnection.initAnchors([
			{
				nodeId: 'node.a',
				anchorId: 'anchor.a',
				contentList: ["I like this a lot1!"],
				authorList: ["Xinzhe Chai"],
				type: "media",
				createdAt: new Date()
			},
			{
				nodeId: 'node.b',
				anchorId: 'anchor.b',
				contentList: ["great job"],
				authorList: ["Jinoo"],
				type: "node",
				createdAt: new Date()
			}
		])
		expect(createResponse.success).toBeTruthy()

		const response2 = await DatabaseConnection.addNewAnnotation('anchor.a', "Me no likey", 'Kira Kelly Clarke')
		expect(response2.success).toBeTruthy()
		expect(Object.keys(response2.payload).length).toBe(6)
		const anchors2 = response2.payload
		expect(anchors2.anchorId).toBe('anchor.a')
		expect(anchors2.nodeId).toBe('node.a')
		expect(anchors2.contentList).toEqual(["I like this a lot1!", "Me no likey"])
		expect(anchors2.authorList).toEqual(["Xinzhe Chai", 'Kira Kelly Clarke'])
		expect(anchors2.type).toBe("media")

		const response3 = await DatabaseConnection.addNewAnnotation('anchor.b', "This looks beautiful", 'Kira Clarke')
		expect(response3.success).toBeTruthy()
		expect(Object.keys(response3.payload).length).toBe(6)
		const anchors3 = response3.payload
		expect(anchors3.anchorId).toBe('anchor.b')
		expect(anchors3.nodeId).toBe('node.b')
		expect(anchors3.contentList).toEqual(["great job", "This looks beautiful"])
		expect(anchors3.authorList).toEqual(["Jinoo", 'Kira Clarke'])
		expect(anchors3.type).toBe("node")

		// test database is actually updated
		const response4 = await DatabaseConnection.findAnchors(['anchor.b'])
		expect(response4.success).toBeTruthy()
		expect(Object.keys(response4.payload).length).toBe(1)
		const anchors4 = response4.payload
		expect(anchors4['anchor.b'].anchorId).toBe('anchor.b')
		expect(anchors4['anchor.b'].nodeId).toBe('node.b')
		expect(anchors4['anchor.b'].contentList).toEqual(["great job", "This looks beautiful"])
		expect(anchors4['anchor.b'].authorList).toEqual(["Jinoo", 'Kira Clarke'])
		expect(anchors4['anchor.b'].type).toBe("node")
		done()
	})

	test("fails on null", async (done) => {
		const response = await DatabaseConnection.addNewAnnotation(null, "sdsad", "dasda");
		expect(response.success).toBeFalsy();
		done();
	});

	test("fails on non-existent anchors", async (done) => {
		const response = await DatabaseConnection.addNewAnnotation("bad-anchor", "hello", "hello");
		expect(response.success).toBeFalsy();
		done();
	})

	test("fails on incomplete annotation", async (done) => {
		const response = await DatabaseConnection.addNewAnnotation("anchor.a", "", "hello");
		expect(response.success).toBeFalsy();
		done();
	})

	test("succeed on incomplete author (anonymous)", async (done) => {
		const response = await DatabaseConnection.addNewAnnotation("anchor.a", "dfdsfsdfsfd", "");
		expect(response.success).toBeTruthy();
		done();
	})
})