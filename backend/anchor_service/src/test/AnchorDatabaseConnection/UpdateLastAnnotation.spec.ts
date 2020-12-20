import DatabaseConnection from '../../dbConfig';

describe('Update Anchor Contents', () => {
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
				contentList: ["I like this a lot1!", "great job"],
				authorList: ["Xinzhe Chai", "Jinoo"],
				type: "media",
				createdAt: new Date()
			},
			{
				nodeId: 'node.b',
				anchorId: 'anchor.b',
				contentList: ["I like this a lot2!", "great job"],
				authorList: ["Xinzhe Chai", "Jinoo"],
				type: "node",
				createdAt: new Date()
			}
		])
		expect(createResponse.success).toBeTruthy()

		const response = await DatabaseConnection.findAnchors(['anchor.a', 'anchor.b'])
		expect(response.success).toBeTruthy()
		expect(Object.keys(response.payload).length).toBe(2)
		const anchors = response.payload
		expect(anchors['anchor.a'].anchorId).toBe('anchor.a')
		expect(anchors['anchor.a'].nodeId).toBe('node.a')
		expect(anchors['anchor.a'].contentList).toEqual(["I like this a lot1!", "great job"])
		expect(anchors['anchor.a'].type).toBe("media")
		expect(anchors['anchor.b'].anchorId).toBe('anchor.b')
		expect(anchors['anchor.b'].nodeId).toBe('node.b')
		expect(anchors['anchor.b'].contentList).toEqual(["I like this a lot2!", "great job"])
		expect(anchors['anchor.b'].type).toBe("node")

		const response2 = await DatabaseConnection.updateLastAnnotation('anchor.b', "Me no likey", 'Kira Kelly Clarke')
		expect(response2.success).toBeTruthy()
		expect(Object.keys(response2.payload).length).toBe(6)
		const anchors2 = response2.payload
		expect(anchors2.anchorId).toBe('anchor.b')
		expect(anchors2.nodeId).toBe('node.b')
		expect(anchors2.contentList).toEqual(["I like this a lot2!", "Me no likey"])
		expect(anchors2.authorList).toEqual(["Xinzhe Chai", 'Kira Kelly Clarke'])
		expect(anchors2.type).toBe("node")

		const response3 = await DatabaseConnection.updateLastAnnotation('anchor.a', "This looks beautiful", 'Kira Kelly Clarke')
		expect(response3.success).toBeTruthy()
		expect(Object.keys(response3.payload).length).toBe(6)
		const anchors3 = response3.payload
		expect(anchors3.anchorId).toBe('anchor.a')
		expect(anchors3.nodeId).toBe('node.a')
		expect(anchors3.contentList).toEqual(["I like this a lot1!", "This looks beautiful"])
		expect(anchors3.authorList).toEqual(["Xinzhe Chai", 'Kira Kelly Clarke'])
		expect(anchors3.type).toBe("media")

		const response4 = await DatabaseConnection.findAnchors(['anchor.a'])
		expect(response4.success).toBeTruthy()
		expect(Object.keys(response4.payload).length).toBe(1)
		const anchors4 = response4.payload
		expect(anchors4['anchor.a'].anchorId).toBe('anchor.a')
		expect(anchors4['anchor.a'].nodeId).toBe('node.a')
		expect(anchors4['anchor.a'].contentList).toEqual(["I like this a lot1!", "This looks beautiful"])
		expect(anchors4['anchor.a'].authorList).toEqual(["Xinzhe Chai", 'Kira Kelly Clarke'])
		expect(anchors4['anchor.a'].type).toBe("media")
		done()
	})

	test("fails on null", async (done) => {
		const response = await DatabaseConnection.updateLastAnnotation(null, "hello", "hello");
		expect(response.success).toBeFalsy();
		done();
	})

	test("fails on non-existent anchors", async (done) => {
		const response = await DatabaseConnection.updateLastAnnotation("bad-anchor", "hello", "hello");
		expect(response.success).toBeFalsy();
		done();
	})

	test("fails on incomplete annotation", async (done) => {
		const response = await DatabaseConnection.updateLastAnnotation("anchor.a", "", "hello");
		expect(response.success).toBeFalsy();
		done();
	})

	test("succeeds on incomplete author (anonymous)", async (done) => {
		const response = await DatabaseConnection.updateLastAnnotation("anchor.a", "dfdsfsdfsfd", "");
		expect(response.success).toBeTruthy();
		done();
	})
})