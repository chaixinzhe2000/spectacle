import { IServiceResponse, IPDFNode } from 'spectacle-interfaces'
import request from 'supertest'
import app from '../../../app'
import DatabaseConnection from '../../dbConfig';
import { isServiceResponse } from './DataFlowRequest.spec'

const service = '/pdf'

const testNode: IPDFNode = {
	nodeId: "nodex.test",
	pdfUrl: "https://admission.brown.edu/sites/g/files/dprerj526/files/2020-01/brown-university-campus-map.pdf",
}

describe('Unit Test: Create Node Request', () => {

	afterAll(async done => {
		const response = await DatabaseConnection.clearNodeCollection()
		expect(response.success).toBeTruthy()
		done()
	})

	test("creates node", async done => {
		const response = await DatabaseConnection.clearNodeCollection()
		expect(response.success).toBeTruthy()

		const getResponse1 = await DatabaseConnection.findNode(testNode.nodeId)
		expect(getResponse1.success).toBeFalsy()

		const createResponse = await request(app).post(service).send({ data: testNode }).expect(200).expect('Content-Type', /json/)
		expect(isServiceResponse(createResponse.body)).toBeTruthy()
		const sr: IServiceResponse<IPDFNode> = createResponse.body
		expect(sr.success).toBeTruthy()
		expect(sr.payload.pdfUrl).toBe(testNode.pdfUrl)
		expect(sr.payload.nodeId).toBe(testNode.nodeId)


		const getResponse2 = await DatabaseConnection.findNode(testNode.nodeId)
		expect(getResponse2.success).toBeTruthy()
		expect(getResponse2.payload.nodeId).toBe(testNode.nodeId)
		expect(getResponse2.payload.pdfUrl).toEqual(testNode.pdfUrl)

		const createResponse2 = await request(app).post(service).send({ data: testNode }).expect(200).expect('Content-Type', /json/)
		expect(isServiceResponse(createResponse2.body)).toBeTruthy()
		const sr2: IServiceResponse<IPDFNode> = createResponse2.body
		expect(sr2.success).toBeFalsy()
		done()
	})

	test("doesn't create invalid node, Express should still return a 200 with a failed IServiceResponse", async done => {
		const response = await DatabaseConnection.clearNodeCollection()
		expect(response.success).toBeTruthy()

		const createResponse = await request(app).post(service).send({ data: { nodeId: '', pdfUrl: '', label: ''} }).expect(200).expect('Content-Type', /json/)
		expect(isServiceResponse(createResponse.body)).toBeTruthy()
		const sr: IServiceResponse<IPDFNode> = createResponse.body
		expect(sr.success).toBeFalsy()

		const createResponse2 = await request(app).post(service).send(testNode).expect(200).expect('Content-Type', /json/)
		expect(isServiceResponse(createResponse2.body)).toBeTruthy()
		const sr2: IServiceResponse<IPDFNode> = createResponse2.body
		expect(sr2.success).toBeFalsy()

		const createResponse3 = await request(app).post(service).send().expect(200).expect('Content-Type', /json/)
		expect(isServiceResponse(createResponse3.body)).toBeTruthy()
		const sr3: IServiceResponse<IPDFNode> = createResponse3.body
		expect(sr3.success).toBeFalsy()
		done()
	})
})

