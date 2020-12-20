import { IServiceResponse } from 'spectacle-interfaces'
import request from 'supertest'
import app from '../../../app'


export function isServiceResponse<T>(sr: any): sr is IServiceResponse<T> {
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
			const deleteResponse = await request(app).delete('/pdf/testid').expect(200).expect('Content-Type', /json/)
			expect(isServiceResponse(deleteResponse.body)).toBeTruthy()
			done()
		} catch {
			done()
		}

	})

	test("deletes document", async done => {

		const createResponse = await request(app).post('/pdf').send({
			data: {
				nodeId: 'testid',
				pdfUrl: "https://www.michigan.gov/documents/leo/Teaching_Through_Memes_PowerPoint_693511_7.pdf"
			}
		}).expect(200).expect('Content-Type', /json/)
		expect(isServiceResponse(createResponse.body)).toBeTruthy()
		done()

	})

	test("deletes document", async done => {

		const getResponse = await request(app).get('/pdf/testid').expect(200).expect('Content-Type', /json/)
		expect(isServiceResponse(getResponse.body)).toBeTruthy()
		done()

	})

	test("deletes document", async done => {
		const deleteResponse2 = await request(app).delete('/pdf/testid').expect(200).expect('Content-Type', /json/)
		expect(isServiceResponse(deleteResponse2.body)).toBeTruthy()
		done()
	})

	test("deletes document", async done => {
		const getResponse = await request(app).get('/pdf/testid').expect('Content-Type', /json/).expect(200)
		expect(isServiceResponse(getResponse.body)).toBeTruthy()
		done()
	})
})

