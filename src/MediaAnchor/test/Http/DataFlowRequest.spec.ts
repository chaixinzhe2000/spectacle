import { IServiceResponse } from 'apposition-interfaces'
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

  test("deletes anchor", async done => {
    try {
      const deleteResponse = await request(app).delete('/media-anchor/testid').expect(200).expect('Content-Type', /json/)
      expect(isServiceResponse(deleteResponse.body)).toBeTruthy()
      done()
    } catch {
      done()
    }
    
  })

  test("creates anchor", async done => {

    const createResponse = await request(app).post('/media-anchor').send({data: {
          anchorId: 'testid',
          start: 0,
          end: 10
        }}).expect(200).expect('Content-Type', /json/)
        expect(isServiceResponse(createResponse.body)).toBeTruthy()
done()
    
  })

  test("gets anchor", async done => {
    const getResponse = await request(app).get('/media-anchor/testid').expect(200).expect('Content-Type', /json/)
    expect(isServiceResponse(getResponse.body)).toBeTruthy()
    done()
    
  })

  test("deletes anchor", async done => {
    const deleteResponse2 = await request(app).delete('/media-anchor/testid').expect(200).expect('Content-Type', /json/)
    expect(isServiceResponse(deleteResponse2.body)).toBeTruthy()
    done()
  })

  test("gets anchor", async done => {
    const getResponse = await request(app).get('/media-anchor/testid').expect('Content-Type', /json/).expect(200)
    expect(isServiceResponse(getResponse.body)).toBeTruthy()
    done()
  })
})

