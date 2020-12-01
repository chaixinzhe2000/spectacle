import { IServiceResponse, IAnchor } from 'spectacle-interfaces'
import request from 'supertest'
import app from '../../app'
import DatabaseConnection from '../../dbConfig';
import { isServiceResponse } from './DataFlowRequest.spec'

const service = '/anchor'

const testAnchor: IAnchor = {
  anchorId: "anchorx.test",
  nodeId: "nodex.test",
  label: "label"
}

const testAnchor2: IAnchor = {
    anchorId: "anchorx.1",
    nodeId: "nodex.test",
    label: "label"
}

const testAnchor3: IAnchor = {
    anchorId: "anchorx.2",
    nodeId: "nodex.1",
    label: "label"
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
        const sr: IServiceResponse<{[anchorId: string]: IAnchor}> = getResponse.body
        expect(sr.success).toBeTruthy()
        expect(sr.payload).toBeDefined()
        expect(Object.keys(sr.payload).length).toBe(2)
        expect(sr.payload[testAnchor.anchorId]).toStrictEqual(testAnchor)
        expect(sr.payload[testAnchor2.anchorId]).toStrictEqual(testAnchor2)

        const deleteResponse = await DatabaseConnection.deleteAnchorsByNode(testAnchor.nodeId)
        expect(deleteResponse.success).toBeTruthy()

        const getResponse2 = await request(app).get(`${service}/node/${testAnchor.nodeId}`).expect(200).expect('Content-Type', /json/)
        expect(isServiceResponse(getResponse2.body)).toBeTruthy()
        const sr2: IServiceResponse<{[anchorId: string]: IAnchor}> = getResponse2.body
        expect(sr2.success).toBeFalsy()

        const clearResponse2 = await DatabaseConnection.clearAnchorCollection()
        expect(clearResponse2.success).toBeTruthy()
        done()
    })
})

