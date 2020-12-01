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

describe('Unit Test: Create Node Request', () => { 
  test("creates anchor", async done => {
        const response = await DatabaseConnection.clearAnchorCollection()
        expect(response.success).toBeTruthy()

        const getResponse1 = await DatabaseConnection.findAnchor(testAnchor.anchorId)
        expect(getResponse1.success).toBeFalsy()

		const createResponse = await request(app).post(service).send({data: testAnchor}).expect(200).expect('Content-Type', /json/)
        expect(isServiceResponse(createResponse.body)).toBeTruthy()
        const sr: IServiceResponse<IMediaAnchor> = createResponse.body
        expect(sr.success).toBeTruthy()
        expect(sr.payload).toStrictEqual(testAnchor)

        const getResponse2 = await DatabaseConnection.findAnchor(testAnchor.anchorId)
        expect(getResponse2.success).toBeTruthy()
        expect(getResponse2.payload).toStrictEqual(testAnchor)

        const createResponse2 = await request(app).post(service).send({data: testAnchor}).expect(200).expect('Content-Type', /json/)
        expect(isServiceResponse(createResponse2.body)).toBeTruthy()
        const sr2: IServiceResponse<IMediaAnchor> = createResponse2.body
        expect(sr2.success).toBeFalsy()
        done()
    })
})

