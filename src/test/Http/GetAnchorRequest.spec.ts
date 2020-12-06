import { IServiceResponse, IAnchor } from 'spectacle-interfaces'
import request from 'supertest'
import app from '../../app'
import DatabaseConnection from '../../dbConfig';
import { isServiceResponse } from './DataFlowRequest.spec'

const service = '/anchor'

const testAnchor: IAnchor = {
	anchorId: "anchorx.test",
	nodeId: "nodex.test",
	contentList: ["I like this a lot1!"],
	authorList: ["Xinzhe Chai"],
	type: "node",
	createdAt: new Date()
}

const testAnchor2: IAnchor = {
	anchorId: "anchorx.1",
	nodeId: "nodex.test",
	contentList: ["I like this a lot2!"],
	authorList: ["Xinzhe Chai"],
	type: "media",
	createdAt: new Date()
}

const testAnchor3: IAnchor = {
	anchorId: "anchorx.2",
	nodeId: "nodex.1",
	contentList: ["I like this a lot3!"],
	authorList: ["Xinzhe Chai"],
	type: "media",
	createdAt: new Date()
}

describe('Unit Test: Get Anchor Request', () => {
	test("get anchor by anchor id", async done => {
		const clearResponse = await DatabaseConnection.clearAnchorCollection()
		expect(clearResponse.success).toBeTruthy()

		const initResponse = await DatabaseConnection.initAnchors([
			testAnchor,
			testAnchor2,
			testAnchor3
		])
		expect(initResponse.success).toBeTruthy()


		const getResponse = await request(app).get(`${service}/${testAnchor.anchorId}`).expect(200).expect('Content-Type', /json/)
		expect(isServiceResponse(getResponse.body)).toBeTruthy()
		const sr: IServiceResponse<IAnchor> = getResponse.body
		expect(sr.success).toBeTruthy()
		expect(sr.payload).toBeDefined()
		expect(sr.payload.anchorId).toBe(testAnchor.anchorId)
		expect(sr.payload.nodeId).toBe(testAnchor.nodeId)

		const deleteResponse = await DatabaseConnection.deleteAnchor(testAnchor.anchorId)
		expect(deleteResponse.success).toBeTruthy()

		const getResponse2 = await request(app).get(`${service}/${testAnchor.anchorId}`).expect(200).expect('Content-Type', /json/)
		expect(isServiceResponse(getResponse2.body)).toBeTruthy()
		const sr2: IServiceResponse<IAnchor> = getResponse2.body
		expect(sr2.success).toBeFalsy()

		const clearResponse2 = await DatabaseConnection.clearAnchorCollection()
		expect(clearResponse2.success).toBeTruthy()
		done()
	})

	test("get anchor by node id", async done => {
		const clearResponse = await DatabaseConnection.clearAnchorCollection()
		expect(clearResponse.success).toBeTruthy()

		const initResponse = await DatabaseConnection.initAnchors([
			testAnchor,
			testAnchor2,
			testAnchor3
		])
		expect(initResponse.success).toBeTruthy()

		const getResponse = await request(app).get(`${service}/node/${testAnchor.nodeId}`).expect(200).expect('Content-Type', /json/)
		expect(isServiceResponse(getResponse.body)).toBeTruthy()
		const sr: IServiceResponse<{ [anchorId: string]: IAnchor }> = getResponse.body
		expect(sr.success).toBeTruthy()
		expect(sr.payload).toBeDefined()
		expect(Object.keys(sr.payload).length).toBe(2)
		expect(sr.payload[testAnchor.anchorId].contentList).toEqual(testAnchor.contentList)
		expect(sr.payload[testAnchor.anchorId].type).toBe("node")
		expect(sr.payload[testAnchor2.anchorId].contentList).toEqual(testAnchor2.contentList)
		expect(sr.payload[testAnchor2.anchorId].type).toBe("media")

		const deleteResponse = await DatabaseConnection.deleteAnchorsByNode(testAnchor.nodeId)
		expect(deleteResponse.success).toBeTruthy()

		const getResponse2 = await request(app).get(`${service}/node/${testAnchor.nodeId}`).expect(200).expect('Content-Type', /json/)
		expect(isServiceResponse(getResponse2.body)).toBeTruthy()
		const sr2: IServiceResponse<{ [anchorId: string]: IAnchor }> = getResponse2.body
		expect(sr2.success).toBeFalsy()

		const clearResponse2 = await DatabaseConnection.clearAnchorCollection()
		expect(clearResponse2.success).toBeTruthy()
		done()
	})
})

