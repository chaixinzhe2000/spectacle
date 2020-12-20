import { IServiceResponse, IMediaAnchor } from 'spectacle-interfaces'
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
		const sr: IServiceResponse<IMediaAnchor> = getResponse.body
		expect(sr.success).toBeTruthy()
		expect(sr.payload).toBeDefined()
		expect(sr.payload).toStrictEqual(testAnchor)

		const deleteResponse = await DatabaseConnection.deleteAnchor(testAnchor.anchorId)
		expect(deleteResponse.success).toBeTruthy()

		const getResponse2 = await request(app).get(`${service}/${testAnchor.anchorId}`).expect(200).expect('Content-Type', /json/)
		expect(isServiceResponse(getResponse2.body)).toBeTruthy()
		const sr2: IServiceResponse<IMediaAnchor> = getResponse2.body
		expect(sr2.success).toBeFalsy()

		const clearResponse2 = await DatabaseConnection.clearAnchorCollection()
		expect(clearResponse2.success).toBeTruthy()
		done()
	})

	test("gets multiple anchors by anchor id", async (done) => {
		const clearResponse = await DatabaseConnection.clearAnchorCollection();
		expect(clearResponse.success).toBeTruthy();

		const initResponse = await DatabaseConnection.initAnchors([
			testAnchor,
			testAnchor2,
			testAnchor3,
		]);
		expect(initResponse.success).toBeTruthy();

		const getResponse = await request(app)
			.get(
				`${service}/list/${[testAnchor.anchorId, testAnchor2.anchorId, "random"].join(
					","
				)}`
			)
			.expect(200)
			.expect("Content-Type", /json/);
		expect(isServiceResponse(getResponse.body)).toBeTruthy();
		const sr: IServiceResponse<{ [anchorId: string]: IMediaAnchor }> =
			getResponse.body;
		expect(sr.success).toBeTruthy();
		expect(sr.payload).toBeDefined();
		expect(Object.keys(sr.payload).length).toBe(2);
		const anchors = sr.payload;
		expect(anchors[testAnchor.anchorId]).toStrictEqual(testAnchor);
		expect(anchors[testAnchor2.anchorId]).toStrictEqual(testAnchor2);

		const deleteResponse = await DatabaseConnection.deleteAnchors([
			testAnchor2.anchorId,
			testAnchor3.anchorId,
		]);
		expect(deleteResponse.success).toBeTruthy();

		const getResponse2 = await request(app)
			.get(
				`${service}/list/${[testAnchor2.anchorId, testAnchor3.anchorId, "random"].join(
					","
				)}`
			)
			.expect(200)
			.expect("Content-Type", /json/);
		expect(isServiceResponse(getResponse2.body)).toBeTruthy();
		const sr2: IServiceResponse<IMediaAnchor> = getResponse2.body;
		expect(sr2.success).toBeFalsy();

		const clearResponse2 = await DatabaseConnection.clearAnchorCollection();
		expect(clearResponse2.success).toBeTruthy();
		done();
	});
})

