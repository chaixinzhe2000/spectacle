import { IServiceResponse } from 'spectacle-interfaces'
import request from 'supertest'
import app from '../../../app'

function isServiceResponse<T>(sr: any): sr is IServiceResponse<T> {
	return sr.success !== undefined && typeof sr.success === 'boolean'
		&& sr.message !== undefined && typeof sr.message === 'string'
		&& sr.payload !== undefined
}

describe('Unit Test: Get Node', () => {
	afterAll(done => {
		app.removeAllListeners()
		done()
	})

	test("deletes document", async done => {
		try {
			const deleteResponse = await request(app).delete('/media/testid').expect(200).expect('Content-Type', /json/)
			expect(isServiceResponse(deleteResponse.body)).toBeTruthy()
			done()
		} catch {
			done()
		}

	})

	test("deletes document", async done => {

		const createResponse = await request(app).post('/media').send({
			data: {
				nodeId: 'testid',
				mediaUrl: "https://www.youtube.com/watch?v=kQqdf484iyc"
			}
		}).expect(200).expect('Content-Type', /json/)
		expect(isServiceResponse(createResponse.body)).toBeTruthy()
		done()

	})

	test("deletes document", async done => {

		const getResponse = await request(app).get('/media/testid').expect(200).expect('Content-Type', /json/)
		expect(isServiceResponse(getResponse.body)).toBeTruthy()
		done()

	})

	test("deletes document", async done => {
		const deleteResponse2 = await request(app).delete('/media/testid').expect(200).expect('Content-Type', /json/)
		expect(isServiceResponse(deleteResponse2.body)).toBeTruthy()
		done()
	})

	test("deletes document", async done => {
		const getResponse = await request(app).get('/media/testid').expect('Content-Type', /json/).expect(200)
		expect(isServiceResponse(getResponse.body)).toBeTruthy()
		done()
	})
})

