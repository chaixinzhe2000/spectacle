import { IServiceResponse, IAnchor } from 'spectacle-interfaces'
import request from 'supertest'
import app from '../../app'
import DatabaseConnection from '../../dbConfig'

export function isServiceResponse<T>(sr: any): sr is IServiceResponse<T> {
	return sr.success !== undefined && typeof sr.success === 'boolean'
		&& sr.message !== undefined && typeof sr.message === 'string'
		&& sr.payload !== undefined
}

const service = '/anchor'

const testAnchor: IAnchor = {
	anchorId: "anchorx.test",
	nodeId: "nodex.test",
	contentList: ["I like this a lot1!"],
	authorList: ["Xinzhe Chai"],
	type: "immutable-text",
	createdAt: new Date()
}

describe('Anchor Data Flow / Integration Test', () => {
	afterAll(async done => {
		const response = await DatabaseConnection.clearAnchorCollection()
		expect(response.success).toBeTruthy()
		done()
	})


	test("deletes anchor", async done => {
		try {
			const deleteResponse = await request(app).delete(`${service}/${testAnchor.anchorId}`).expect(200).expect('Content-Type', /json/)
			expect(isServiceResponse(deleteResponse.body)).toBeTruthy()
			done()
		} catch {
			done()
		}
	})

	test("creates anchor", async done => {
		const createResponse = await request(app).post(service).send({ data: testAnchor }).expect(200).expect('Content-Type', /json/)
		expect(isServiceResponse(createResponse.body)).toBeTruthy()
		const sr: IServiceResponse<IAnchor> = createResponse.body
		expect(sr.success).toBeTruthy()
		expect(sr.payload.contentList).toEqual(["I like this a lot1!"])
		expect(sr.payload.authorList).toEqual(["Xinzhe Chai"])
		expect(sr.payload.type).toBe("immutable-text")
		done()
	})

	test("gets anchor", async done => {
		const getResponse = await request(app).get(`${service}/anchorx.test`).expect(200).expect('Content-Type', /json/)
		expect(isServiceResponse(getResponse.body)).toBeTruthy()
		const sr: IServiceResponse<IAnchor> = getResponse.body
		expect(sr.success).toBeTruthy()
		expect(sr.payload.contentList).toEqual(["I like this a lot1!"])
		expect(sr.payload.authorList).toEqual(["Xinzhe Chai"])
		expect(sr.payload.type).toBe("immutable-text")
		done()
	})

	test("gets anchor by node", async done => {
		const getResponse = await request(app).get(`${service}/node/nodex.test`).expect(200).expect('Content-Type', /json/)
		expect(isServiceResponse(getResponse.body)).toBeTruthy()
		const sr: IServiceResponse<{ [anchorId: string]: IAnchor }> = getResponse.body
		expect(sr.success).toBeTruthy()
		expect(sr.payload).toBeDefined()
		expect(Object.keys(sr.payload).length).toBe(1)
		expect(sr.payload['anchorx.test'].contentList).toEqual(["I like this a lot1!"])
		expect(sr.payload['anchorx.test'].authorList).toEqual(["Xinzhe Chai"])
		expect(sr.payload['anchorx.test'].type).toBe("immutable-text")
		done()
	})

	test("deletes anchor", async done => {
		const deleteResponse2 = await request(app).delete(`${service}/anchorx.test`).expect(200).expect('Content-Type', /json/)
		expect(isServiceResponse(deleteResponse2.body)).toBeTruthy()
		const sr: IServiceResponse<IAnchor> = deleteResponse2.body
		expect(sr.success).toBeTruthy()
		done()
	})

	test("shouldn't get anchor", async done => {
		const getResponse = await request(app).get(`${service}/anchorx.test`).expect('Content-Type', /json/).expect(200)
		expect(isServiceResponse(getResponse.body)).toBeTruthy()
		const sr: IServiceResponse<IAnchor> = getResponse.body
		expect(sr.success).toBeFalsy()
		done()
	})
})

