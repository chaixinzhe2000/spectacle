import { IServiceResponse, IMediaAnchor } from 'apposition-interfaces'
import request from 'supertest'
import app from '../../../app'
import DatabaseConnection from '../../dbConfig'
import { isServiceResponse } from './DataFlowRequest.spec'

const service = '/media-anchor'

const testAnchor: IMediaAnchor = {
	anchorId: "anchorx.test",
	mediaTimeStamp: 10
}

const testAnchor2: IMediaAnchor = {
	anchorId: "anchorx.1",
	mediaTimeStamp: 10
}

const testAnchor3: IMediaAnchor = {
	anchorId: "anchorx.2",
	mediaTimeStamp: 10
}

describe('Unit Test: Delete Anchor Request', () => {
	test("delete anchor by anchor id", async done => {
		const clearResponse = await DatabaseConnection.clearAnchorCollection()
		expect(clearResponse.success).toBeTruthy()

		const initResponse = await DatabaseConnection.initAnchors([
			testAnchor,
			testAnchor2,
			testAnchor3
		])
		expect(initResponse.success).toBeTruthy()

		const getResponse1 = await DatabaseConnection.findAnchor(testAnchor.anchorId)
		expect(getResponse1.success).toBeTruthy()
		expect(getResponse1.payload).toStrictEqual(testAnchor)

		const deleteResponse = await request(app).delete(`${service}/anchorx.test`).expect(200).expect('Content-Type', /json/)
		expect(isServiceResponse(deleteResponse.body)).toBeTruthy()
		const sr: IServiceResponse<{}> = deleteResponse.body
		expect(sr.success).toBeTruthy()

		const getResponse2 = await DatabaseConnection.findAnchor(testAnchor.anchorId)
		expect(getResponse2.success).toBeFalsy()

		const clearResponse2 = await DatabaseConnection.clearAnchorCollection()
		expect(clearResponse2.success).toBeTruthy()
		done()
	})

	test("delete anchor by node id", async done => {
		const clearResponse = await DatabaseConnection.clearAnchorCollection()
		expect(clearResponse.success).toBeTruthy()

		const initResponse = await DatabaseConnection.initAnchors([
			testAnchor,
			testAnchor2,
			testAnchor3
		])
		expect(initResponse.success).toBeTruthy()

		const getResponse1 = await DatabaseConnection.findAnchor(testAnchor.anchorId)
		expect(getResponse1.success).toBeTruthy()
		expect(getResponse1.payload).toStrictEqual(testAnchor)

		const getResponse2 = await DatabaseConnection.findAnchor(testAnchor2.anchorId)
		expect(getResponse2.success).toBeTruthy()
		expect(getResponse2.payload).toStrictEqual(testAnchor2)

		const getResponse3 = await DatabaseConnection.findAnchor(testAnchor3.anchorId)
		expect(getResponse3.success).toBeTruthy()
		expect(getResponse3.payload).toStrictEqual(testAnchor3)

		const deleteResponse = await request(app).delete(`${service}/list/${[testAnchor.anchorId, testAnchor2.anchorId].join(',')}`).expect(200).expect('Content-Type', /json/)
		expect(isServiceResponse(deleteResponse.body)).toBeTruthy()
		const sr: IServiceResponse<{}> = deleteResponse.body
		expect(sr.success).toBeTruthy()

		const getResponse4 = await DatabaseConnection.findAnchor(testAnchor.anchorId)
		expect(getResponse4.success).toBeFalsy()

		const getResponse6 = await DatabaseConnection.findAnchor(testAnchor2.anchorId)
		expect(getResponse6.success).toBeFalsy()

		const getResponse5 = await DatabaseConnection.findAnchor(testAnchor3.anchorId)
		expect(getResponse5.success).toBeTruthy()
		expect(getResponse5.payload).toStrictEqual(testAnchor3)

		const clearResponse2 = await DatabaseConnection.clearAnchorCollection()
		expect(clearResponse2.success).toBeTruthy()
		done()
	})
})

