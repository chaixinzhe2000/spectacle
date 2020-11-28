import { IServiceResponse, ILink } from "hypertext-interfaces";
import request from "supertest";
import app from "../../app";
import DatabaseConnection from "../../dbConfig";
import { isServiceResponse } from "./LinkDataFlowRequest.spec";

const service = "/link";

const testLink: ILink = {
  linkId: "linkx.test",
  srcAnchorId: "srcanchorx.test",
  destAnchorId: "destanchorx.test",
  srcNodeId: "srcnodex.test",
  destNodeId: "destnodex.test",
};

describe("Unit Test: Create Link Request", () => {
  afterAll(async (done) => {
    const clearResponse = await DatabaseConnection.clearLinkCollection();
    expect(clearResponse.success).toBeTruthy();
    done();
  });
  beforeAll(async (done) => {
    const clearResponse = await DatabaseConnection.clearLinkCollection();
    expect(clearResponse.success).toBeTruthy();
    done();
  });

  test("creates node", async (done) => {
    const response = await DatabaseConnection.clearLinkCollection();
    expect(response.success).toBeTruthy();

    const getResponse1 = await DatabaseConnection.findLink(testLink.linkId);
    expect(getResponse1.success).toBeFalsy();

    const createResponse = await request(app)
      .post(service)
      .send({ data: testLink })
      .expect(200)
      .expect("Content-Type", /json/);
    expect(isServiceResponse(createResponse.body)).toBeTruthy();
    const sr: IServiceResponse<ILink> = createResponse.body;
    expect(sr.success).toBeTruthy();
    expect(sr.payload.linkId).toBe(testLink.linkId);
    expect(sr.payload.srcAnchorId).toBe(testLink.srcAnchorId);
    expect(sr.payload.destAnchorId).toBe(testLink.destAnchorId);
    expect(sr.payload.srcNodeId).toBe(testLink.srcNodeId);
    expect(sr.payload.destNodeId).toBe(testLink.destNodeId);

    const getResponse2 = await DatabaseConnection.findLink(testLink.linkId);
    expect(getResponse2.success).toBeTruthy();
    expect(getResponse2.payload.linkId).toBe(testLink.linkId);
    expect(getResponse2.payload.srcAnchorId).toBe(testLink.srcAnchorId);
    expect(getResponse2.payload.destAnchorId).toBe(testLink.destAnchorId);
    expect(getResponse2.payload.destNodeId).toBe(testLink.destNodeId);
    expect(getResponse2.payload.srcNodeId).toBe(testLink.srcNodeId);

    const createResponse2 = await request(app)
      .post(service)
      .send({ data: testLink })
      .expect(200)
      .expect("Content-Type", /json/);
    expect(isServiceResponse(createResponse2.body)).toBeTruthy();
    const sr2: IServiceResponse<ILink> = createResponse2.body;
    expect(sr2.success).toBeFalsy();
    done();
  });

  test("doesn't create invalid anchor, Express should still return a 200 with a failed IServiceResponse", async done => {
      const response = await DatabaseConnection.clearLinkCollection()
      expect(response.success).toBeTruthy()

      const createResponse = await request(app).post(service).send({data: {
        linkId: "",
        srcAnchorId: "",
        destAnchorId: "",
        srcNodeId: "",
        destNodeId: "",
      }}).expect(200).expect('Content-Type', /json/)
      expect(isServiceResponse(createResponse.body)).toBeTruthy()
      const sr: IServiceResponse<ILink> = createResponse.body
      expect(sr.success).toBeFalsy()

      const createResponse2 = await request(app).post(service).send(testLink).expect(200).expect('Content-Type', /json/)
      expect(isServiceResponse(createResponse2.body)).toBeTruthy()
      const sr2: IServiceResponse<ILink> = createResponse2.body
      expect(sr2.success).toBeFalsy()

      const createResponse3 = await request(app).post(service).send().expect(200).expect('Content-Type', /json/)
      expect(isServiceResponse(createResponse3.body)).toBeTruthy()
      const sr3: IServiceResponse<ILink> = createResponse3.body
      expect(sr3.success).toBeFalsy()
      done()
    })
});
