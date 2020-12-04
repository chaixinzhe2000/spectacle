import { IServiceResponse, IAnchor } from 'spectacle-interfaces'
import request from 'supertest'
import app from '../../app'
import DatabaseConnection from '../../dbConfig';
import { isServiceResponse } from './DataFlowRequest.spec'

const service = '/anchor'

const testAnchor: IAnchor = {
	anchorId: "anchorx.test",
	nodeId: "nodex.test",
	content: "I like this a lot1!",
	type: "node",
	createdAt: new Date()
}

describe('Unit Test: Update Anchor Content', () => {
	test("add anchors and update content", async done => {
		const clearResponse = await DatabaseConnection.clearAnchorCollection()
		expect(clearResponse.success).toBeTruthy()

		const initResponse = await DatabaseConnection.initAnchors([
			testAnchor
		])
		expect(initResponse.success).toBeTruthy()

		const originalTime = await (await request(app).get(`${service}/${testAnchor.anchorId}`).expect(200).expect('Content-Type', /json/)).body.payload.createdAt
		const getResponse = await request(app).put(`${service}/${testAnchor.anchorId}/content`).send({content: "updated information"}).expect(200).expect('Content-Type', /json/)
		expect(isServiceResponse(getResponse.body)).toBeTruthy()
		const sr: IServiceResponse<IAnchor> = getResponse.body
		expect(sr.success).toBeTruthy()
		expect(sr.payload).toBeDefined()
		expect(sr.payload.anchorId).toBe(testAnchor.anchorId)
		expect(sr.payload.nodeId).toBe(testAnchor.nodeId)
		expect(sr.payload.content).toBe("updated information")
		expect((sr.payload.createdAt) > originalTime)
		const deleteResponse = await DatabaseConnection.deleteAnchor(testAnchor.anchorId)
		expect(deleteResponse.success).toBeTruthy()

		done()
	})
})

