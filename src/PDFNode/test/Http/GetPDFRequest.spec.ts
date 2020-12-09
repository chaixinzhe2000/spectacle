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

const testNode2: IPDFNode= {
	nodeId: "nodex.2",
	pdfUrl: "https://2admission.brown.edu/sites/g/files/dprerj526/files/2020-01/brown-university-campus-map.pdf",
}

const testNode3: IPDFNode = {
	nodeId: "nodex.3",
	pdfUrl: "https://3admission.brown.edu/sites/g/files/dprerj526/files/2020-01/brown-university-campus-map.pdf",
}

describe('Unit Test: Get Node Request', () => {
	test("get node by node id", async done => {
		const clearResponse = await DatabaseConnection.clearNodeCollection()
		expect(clearResponse.success).toBeTruthy()

		const initResponse = await DatabaseConnection.initNodes([
			testNode,
			testNode2,
			testNode3
		])
		expect(initResponse.success).toBeTruthy()

		const getResponse = await request(app).get(`${service}/${testNode.nodeId}`).expect(200).expect('Content-Type', /json/)
		expect(isServiceResponse(getResponse.body)).toBeTruthy()
		const sr: IServiceResponse<IPDFNode> = getResponse.body
		expect(sr.success).toBeTruthy()
		expect(sr.payload).toBeDefined()
		expect(sr.payload.nodeId).toBe(testNode.nodeId)
		expect(sr.payload.pdfUrl).toBe(testNode.pdfUrl)

		const deleteResponse = await DatabaseConnection.deleteNode(testNode.nodeId)
		expect(deleteResponse.success).toBeTruthy()

		const getResponse2 = await request(app).get(`${service}/${testNode.nodeId}`).expect(200).expect('Content-Type', /json/)
		expect(isServiceResponse(getResponse2.body)).toBeTruthy()
		const sr2: IServiceResponse<IPDFNode> = getResponse2.body
		expect(sr2.success).toBeFalsy()

		const clearResponse2 = await DatabaseConnection.clearNodeCollection()
		expect(clearResponse2.success).toBeTruthy()
		done()
	})
})