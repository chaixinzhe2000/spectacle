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
	type: "media",
	createdAt: new Date()
}

describe('Unit Test: Create Anchor Request', () => {

	afterAll(async done => {
		const response = await DatabaseConnection.clearAnchorCollection()
		expect(response.success).toBeTruthy()
		done()
	})

	test("creates anchor", async done => {
		const response = await DatabaseConnection.clearAnchorCollection()
		expect(response.success).toBeTruthy()

		const getResponse1 = await DatabaseConnection.findAnchor(testAnchor.anchorId)
		expect(getResponse1.success).toBeFalsy()

		const createResponse = await request(app).post(service).send({ data: testAnchor }).expect(200).expect('Content-Type', /json/)
		expect(isServiceResponse(createResponse.body)).toBeTruthy()
		const sr: IServiceResponse<IAnchor> = createResponse.body
		expect(sr.success).toBeTruthy()
		expect(sr.payload.anchorId).toBe(testAnchor.anchorId)
		expect(sr.payload.nodeId).toBe(testAnchor.nodeId)
		expect(sr.payload.content).toBe(testAnchor.content)

		const getResponse2 = await DatabaseConnection.findAnchor(testAnchor.anchorId)
		expect(getResponse2.success).toBeTruthy()
		expect(getResponse2.payload.anchorId).toBe(testAnchor.anchorId)
		expect(getResponse2.payload.content).toBe(testAnchor.content)

		const createResponse2 = await request(app).post(service).send({ data: testAnchor }).expect(200).expect('Content-Type', /json/)
		expect(isServiceResponse(createResponse2.body)).toBeTruthy()
		const sr2: IServiceResponse<IAnchor> = createResponse2.body
		expect(sr2.success).toBeFalsy()
		done()
	})

	test("doesn't create invalid anchor, Express should still return a 200 with a failed IServiceResponse", async done => {
		const response = await DatabaseConnection.clearAnchorCollection()
		expect(response.success).toBeTruthy()

		const createResponse = await request(app).post(service).send({ data: { anchorId: '', nodeId: '', label: '' } }).expect(200).expect('Content-Type', /json/)
		expect(isServiceResponse(createResponse.body)).toBeTruthy()
		const sr: IServiceResponse<IAnchor> = createResponse.body
		expect(sr.success).toBeFalsy()

		const createResponse2 = await request(app).post(service).send(testAnchor).expect(200).expect('Content-Type', /json/)
		expect(isServiceResponse(createResponse2.body)).toBeTruthy()
		const sr2: IServiceResponse<IAnchor> = createResponse2.body
		expect(sr2.success).toBeFalsy()

		const createResponse3 = await request(app).post(service).send().expect(200).expect('Content-Type', /json/)
		expect(isServiceResponse(createResponse3.body)).toBeTruthy()
		const sr3: IServiceResponse<IAnchor> = createResponse3.body
		expect(sr3.success).toBeFalsy()
		done()
	})
})

