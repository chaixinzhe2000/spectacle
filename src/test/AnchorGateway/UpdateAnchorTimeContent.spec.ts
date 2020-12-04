import { IAnchorGateway } from 'spectacle-interfaces';
import DatabaseConnection from '../../dbConfig';
import AnchorGateway from '../../gateway/AnchorGateway';

describe('Unit Test: Get Anchor', () => {
	const anchorGateway: IAnchorGateway = new AnchorGateway(DatabaseConnection)

	beforeAll(async done => {
		const response = await DatabaseConnection.clearAnchorCollection()
		expect(response.success).toBeTruthy()

		const createResponse = await DatabaseConnection.initAnchors([
			{
				anchorId: 'a',
				nodeId: 'node.a',
				content: "I like this a lot!",
				type: "media",
				createdAt: new Date()
			},
			{
				anchorId: 'b',
				nodeId: 'node.b',
				content: "I like this a lot!",
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
		const originalTime: Date = await (await anchorGateway.getAnchor('a')).payload.createdAt
		const getResponse = await anchorGateway.updateAnchorContent('a', 'Updated Information')
		expect(getResponse.success).toBeTruthy()
		expect(getResponse.payload.anchorId).toBe('a')
		expect(getResponse.payload.nodeId).toBe('node.a')
		expect(getResponse.payload.content).toBe('Updated Information')
		expect(getResponse.payload.createdAt.getTime() > originalTime.getTime())
		done()
	})
})