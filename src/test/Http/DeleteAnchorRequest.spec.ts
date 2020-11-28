import { IServiceResponse, IAnchor } from 'hypertext-interfaces'
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
        expect(getResponse1.payload.anchorId).toBe(testAnchor.anchorId)
        expect(getResponse1.payload.nodeId).toBe(testAnchor.nodeId)

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

        const getResponse1 = await DatabaseConnection.findAnchors([testAnchor.anchorId, testAnchor2.anchorId, testAnchor3.anchorId])
        expect(getResponse1.success).toBeTruthy()
        const anchors = getResponse1.payload
        expect(Object.keys(anchors).length).toBe(3)
        expect(anchors[testAnchor.anchorId]).toStrictEqual(testAnchor)
        expect(anchors[testAnchor2.anchorId]).toStrictEqual(testAnchor2)
        expect(anchors[testAnchor3.anchorId]).toStrictEqual(testAnchor3)

        const deleteResponse = await request(app).delete(`${service}/node/${testAnchor.nodeId}`).expect(200).expect('Content-Type', /json/)
        expect(isServiceResponse(deleteResponse.body)).toBeTruthy()
        const sr: IServiceResponse<{}> = deleteResponse.body
        expect(sr.success).toBeTruthy()

        const getResponse2 = await DatabaseConnection.findAnchors([testAnchor.anchorId, testAnchor2.anchorId, testAnchor3.anchorId])
        expect(getResponse2.success).toBeTruthy()
        const anchors2 = getResponse2.payload
        expect(Object.keys(anchors2).length).toBe(1)
        expect(anchors2[testAnchor3.anchorId]).toStrictEqual(testAnchor3)

        const clearResponse2 = await DatabaseConnection.clearAnchorCollection()
        expect(clearResponse2.success).toBeTruthy()
        done()
    })
})

