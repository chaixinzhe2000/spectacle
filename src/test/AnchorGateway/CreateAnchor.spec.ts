import { IAnchor, IAnchorGateway } from 'spectacle-interfaces';
import DatabaseConnection from '../../dbConfig';
import AnchorGateway from '../../gateway/AnchorGateway';

describe('Gateway Test: Create Anchor', () => {
	const anchorGateway: IAnchorGateway = new AnchorGateway(DatabaseConnection)

	beforeAll(async done => {
		const response = await DatabaseConnection.clearAnchorCollection()
		expect(response.success).toBeTruthy()
		done()
	})

	afterAll(async done => {
		const response = await DatabaseConnection.clearAnchorCollection()
		expect(response.success).toBeTruthy()
		done()
	})

	test("doesn't create invalid anchor", async done => {
		const badanchor: any = { 'id': 'id' }
		const response = await anchorGateway.createAnchor(badanchor)
		expect(response.success).toBeFalsy()
		done()
	})

	test("creates valid anchor", async done => {
		const validanchor: IAnchor = {
			nodeId: 'node.id',
			anchorId: 'anchor.id',
            contentList: ["Hello Chai Hello Chai"],
            authorList: ["Chai"],
			type: "node",
			createdAt: new Date()
		}

		const getResponse = await DatabaseConnection.findAnchor(validanchor.anchorId)
		expect(getResponse.success).toBeFalsy()

		const response = await anchorGateway.createAnchor(validanchor)
		expect(response.success).toBeTruthy()

		const getResponse2 = await DatabaseConnection.findAnchor(validanchor.anchorId)
		expect(getResponse2.success).toBeTruthy()
        expect(getResponse2.payload.contentList).toEqual(["Hello Chai Hello Chai"])
        expect(getResponse2.payload.authorList).toEqual(["Chai"])
		expect(getResponse2.payload.type).toBe("node")
		done()
	})


	test("creates valid anchor, fails to create valid anchor with same id", async done => {
		const validanchor: IAnchor = {
			nodeId: 'node.id',
			anchorId: 'anchor.id2',
            contentList: ["I like this a lot mmm!"],
            authorList: ["Jinoo"],
			type: "media",
			createdAt: new Date()
		}

		const getResponse = await DatabaseConnection.findAnchor(validanchor.anchorId)
		expect(getResponse.success).toBeFalsy()

		const response = await anchorGateway.createAnchor(validanchor)
		expect(response.success).toBeTruthy()

		const getResponse2 = await DatabaseConnection.findAnchor(validanchor.anchorId)
		expect(getResponse2.success).toBeTruthy()
        expect(getResponse2.payload.contentList).toEqual(["I like this a lot mmm!"])
        expect(getResponse2.payload.authorList).toEqual(["Jinoo"])
		expect(getResponse2.payload.type).toBe("media")

		const validanchor2: IAnchor = {
			nodeId: 'id2',
			anchorId: 'anchor.id2',
			contentList: ["I like this a lot mmm!"],
            authorList: ["Jinoo"],
			type: "media",
			createdAt: new Date()
		}

		const response2 = await anchorGateway.createAnchor(validanchor2)
		expect(response2.success).toBeFalsy()

		const getResponse3 = await DatabaseConnection.findAnchor(validanchor.anchorId)
		expect(getResponse3.success).toBeTruthy()
        expect(getResponse2.payload.contentList).toEqual(["I like this a lot mmm!"])
        expect(getResponse2.payload.authorList).toEqual(["Jinoo"])
		expect(getResponse2.payload.type).toBe("media")
		done()
	})

	test("fails to create when anchorId is null", async done => {
		const invalidanchor: any = {
			nodeId: 'id4',
			anchorId: null,
            contentList: ["I like this a lot mmm!"],
            authorList: ["Jinoo"],
			type: "media",
			createdAt: new Date()
		}
		const response = await anchorGateway.createAnchor(invalidanchor)
		expect(response.success).toBeFalsy()
		done()
	})

	test("fails to create anchor when anchorId is number", async done => {
		const invalidanchor: any = {
			nodeId: 'id4',
			anchorId: 5,
			content: "I like this a lot!",
			type: "media",
			createdAt: new Date()
		}
		const response = await anchorGateway.createAnchor(invalidanchor)
		expect(response.success).toBeFalsy()
		done()
	})

	test("fails to create anchor when anchorId is empty", async done => {
		const invalidanchor: any = {
			nodeId: 'id4',
			anchorId: '',
			content: "I like this a lot!",
			type: "media",
			createdAt: new Date()
		}
		const response = await anchorGateway.createAnchor(invalidanchor)
		expect(response.success).toBeFalsy()
		done()
	})
})