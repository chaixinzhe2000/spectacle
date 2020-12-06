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
		expect(anchors['anchor.a'].authorList).toEqual(["Xinzhe Chai", "Jinoo"])
		expect(anchors['anchor.a'].type).toBe("media")
		expect(anchors['anchor.b'].anchorId).toBe('anchor.b')
		expect(anchors['anchor.b'].nodeId).toBe('node.b')
		expect(anchors['anchor.b'].contentList).toEqual(["I like this a lot2!", "great job"])
		expect(anchors['anchor.b'].authorList).toEqual(["Xinzhe Chai", "Jinoo"])
		expect(anchors['anchor.b'].type).toBe("node")

		const response2 = await DatabaseConnection.findAnchors(['anchor.a'])
		expect(response2.success).toBeTruthy()
		expect(Object.keys(response2.payload).length).toBe(1)
		const anchors2 = response.payload
		const originalCreatedAt: Date = anchors2['anchor.a'].createdAt

		const response3 = await DatabaseConnection.updateLastAnnotation('anchor.a', 'hello hello', "Kira Kelly")
		expect(response3.success).toBeTruthy()
		expect(Object.keys(response3.payload).length).toBe(6)
		const anchors3 = response3.payload
		expect(anchors3.anchorId).toBe('anchor.a')
		expect(anchors3.nodeId).toBe('node.a')
		expect(anchors3.contentList).toEqual(["I like this a lot1!", "hello hello"])
		expect(anchors3.authorList).toEqual(["Xinzhe Chai", "Kira Kelly"])
		expect(anchors3.type).toBe("media")
		expect(anchors3.createdAt.getTime() > originalCreatedAt.getTime())

		await DatabaseConnection.updateLastAnnotation('anchor.a', "replaced content 1", "Ben")

		const response4 = await DatabaseConnection.findAnchors(['anchor.a'])
		expect(response4.success).toBeTruthy()
		expect(Object.keys(response4.payload).length).toBe(1)
		const anchors4 = response4.payload
		expect(anchors4['anchor.a'].anchorId).toBe('anchor.a')
		expect(anchors4['anchor.a'].nodeId).toBe('node.a')
		expect(anchors4['anchor.a'].contentList).toEqual(["I like this a lot1!", "replaced content 1"])
		expect(anchors4['anchor.a'].authorList).toEqual(["Xinzhe Chai", "Ben"])
		expect(anchors4['anchor.a'].type).toBe("media")
		expect(anchors4['anchor.a'].createdAt.getTime() > originalCreatedAt.getTime())
		done()
	})

	test("fails on null", async (done) => {
		const response = await DatabaseConnection.findAnchors(null);
		expect(response.success).toBeFalsy();
		done();
	});
})