import { IAnchorGateway } from 'spectacle-interfaces';
import DatabaseConnection from '../../dbConfig';
import AnchorGateway from '../../gateway/AnchorGateway';

describe('Unit Test: updateLastAnnotation', () => {
	const anchorGateway: IAnchorGateway = new AnchorGateway(DatabaseConnection)

	beforeAll(async done => {
		const response = await DatabaseConnection.clearAnchorCollection()
		expect(response.success).toBeTruthy()

		const createResponse = await DatabaseConnection.initAnchors([
			{
                anchorId: 'a',
                nodeId: 'node.a',
                contentList: ["content A"],
                authorList: ["author A"],
                type: "media",
                createdAt: new Date()
            },
            {
                anchorId: 'b',
                nodeId: 'node.b',
                contentList: ["content B"],
                authorList: ["author B"],
                type: "media",
                createdAt: new Date()
            },
            {
                anchorId: 'c',
                nodeId: 'node.b',
                contentList: ["content C"],
                authorList: ["author C"],
                type: "media",
                createdAt: new Date()
            },
            {
                anchorId: 'd',
                nodeId: 'node.b',
                contentList: ["content D"],
                authorList: ["author D"],
                type: "media",
                createdAt: new Date()
            }
		])
		expect(createResponse.success).toBeTruthy()
		done()
	})

	afterAll(async done => {
		const response = await DatabaseConnection.clearAnchorCollection()
		expect(response.success).toBeTruthy()
		done()
	})

	test("successfully updates anchor content", async done => {
        const findResponse = await DatabaseConnection.findAnchor('a')
        expect(findResponse.success).toBeTruthy()

		const originalTime: Date = await (await anchorGateway.getAnchor('a')).payload.createdAt
		const getResponse = await anchorGateway.updateLastAnnotation('a', 'Updated Information')
		expect(getResponse.success).toBeTruthy()
		expect(getResponse.payload.anchorId).toBe('a')
		expect(getResponse.payload.nodeId).toBe('node.a')
		expect(getResponse.payload.contentList).toEqual('Updated Information')
		expect(getResponse.payload.createdAt.getTime() > originalTime.getTime())
		done()
    })
    // TODO: check that it works when anchorId, content and author are valid
    // TODO: check that author is "Anonymous" when author is "" and then also check when author is null
    // TODO: doesn't update annotation if anchorId is not found or invalid
    // TODO: delete last annotation if content is null and author is "valid author"
    // TODO: delete last annotation if content is "" and author is "valid author"
    // TODO: delete last annotation if content is null and author is null
    // TODO: delete last annotation if content is null and author is ""
    // TODO: delete last annotation if content is "" and author is null
    // TODO: failed if content is not of type string
    // TODO: failed if author is not of type string
    
})