import { IServiceResponse, ILink } from "spectacle-interfaces";
import request from "supertest";
import app from "../../app";
import DatabaseConnection from "../../dbConfig";
import { isServiceResponse } from "./LinkDataFlowRequest.spec";

const service = "/link";

const testLink: ILink = {
  linkId: "linkx.test",
  srcAnchorId: "srcanchorx.test",
  destNodeId: "destnodex.test",
};

const testLink2: ILink = {
  linkId: "linkx.1",
  srcNodeId: "srcnodex.test",
  destNodeId: "destnodex.1",
};

const testLink3: ILink = {
  linkId: "linkx.2",
  srcAnchorId: "srcanchorx.2",
  destNodeId: "destnodex.test",
};

describe("Unit Test: Get Link Request", () => {
  const linkDbConnection = DatabaseConnection;

  beforeEach(async (done) => {
    const response = await linkDbConnection.clearLinkCollection();
    expect(response.success).toBeTruthy();

    const createResponse = await linkDbConnection.initLinks([
      testLink,
      testLink2,
      testLink3,
    ]);
    expect(createResponse.success).toBeTruthy();
    done();
  });

  afterAll(async (done) => {
    const response = await linkDbConnection.clearLinkCollection();
    expect(response.success).toBeTruthy();
    app.removeAllListeners();
    done();
  });

  test("get link by link id", async (done) => {
    const getResponse = await request(app)
      .get(`${service}/${testLink.linkId}`)
      .expect(200)
      .expect("Content-Type", /json/);
    expect(isServiceResponse(getResponse.body)).toBeTruthy();
    const sr: IServiceResponse<ILink> = getResponse.body;
    expect(sr.success).toBeTruthy();
	expect(sr.payload).toBeDefined();
	expect(sr.payload.linkId).toBe(testLink.linkId);
	expect(sr.payload.srcAnchorId).toBe(testLink.srcAnchorId);
	expect(sr.payload.destNodeId).toBe(testLink.destNodeId);
	expect(sr.payload.srcNodeId).toBe(null);
	expect(sr.payload.destAnchorId).toBe(null);

    const deleteResponse = await linkDbConnection.deleteLink(testLink.linkId);
    expect(deleteResponse.success).toBeTruthy();

    const getResponse2 = await request(app)
      .get(`${service}/${testLink.linkId}`)
      .expect(200)
      .expect("Content-Type", /json/);
    expect(isServiceResponse(getResponse2.body)).toBeTruthy();
    const sr2: IServiceResponse<ILink> = getResponse2.body;
    expect(sr2.success).toBeFalsy();
    done();
  });

  test("get links by node id", async (done) => {
    const getResponse = await request(app)
      .get(`${service}/node/${testLink.destNodeId}`)
      .expect(200)
      .expect("Content-Type", /json/);
    expect(isServiceResponse(getResponse.body)).toBeTruthy();
    const sr: IServiceResponse<{ [linkId: string]: ILink }> = getResponse.body;
    expect(sr.success).toBeTruthy();
    expect(sr.payload).toBeDefined();
    expect(Object.keys(sr.payload).length).toBe(2);
    expect(sr.payload[testLink.linkId].linkId).toBe(testLink.linkId);
    expect(sr.payload[testLink3.linkId].linkId).toStrictEqual(testLink3.linkId);
	expect(sr.payload[testLink3.linkId].srcAnchorId).toStrictEqual(testLink3.srcAnchorId);

    const deleteResponse = await linkDbConnection.deleteNodeLinks(
      testLink.srcNodeId
    );
    expect(deleteResponse.success).toBeTruthy();

    const getResponse2 = await request(app)
      .get(`${service}/node/${testLink.srcNodeId}`)
      .expect(200)
      .expect("Content-Type", /json/);
    expect(isServiceResponse(getResponse2.body)).toBeTruthy();
    const sr2: IServiceResponse<{ [linkId: string]: ILink }> =
      getResponse2.body;
    expect(sr2.success).toBeFalsy();
    done();
  });

  test("get links by anchor id", async (done) => {
    const getResponse = await request(app)
      .get(`${service}/anchor/${testLink.srcAnchorId}`)
      .expect(200)
      .expect("Content-Type", /json/);
    expect(isServiceResponse(getResponse.body)).toBeTruthy();
    const sr: IServiceResponse<{ [linkId: string]: ILink }> = getResponse.body;
    expect(sr.success).toBeTruthy();
    expect(sr.payload).toBeDefined();
    expect(Object.keys(sr.payload).length).toBe(1);
    expect(sr.payload[testLink.linkId].destNodeId).toStrictEqual(testLink.destNodeId);
    expect(sr.payload[testLink2.linkId]).toBe(undefined);

    const deleteResponse = await linkDbConnection.deleteAnchorLinks(
      testLink.srcAnchorId
    );
    expect(deleteResponse.success).toBeTruthy();

    const getResponse2 = await request(app)
      .get(`${service}/anchor/${testLink.srcAnchorId}`)
      .expect(200)
      .expect("Content-Type", /json/);
    expect(isServiceResponse(getResponse2.body)).toBeTruthy();
    const sr2: IServiceResponse<{ [linkId: string]: ILink }> =
      getResponse2.body;
    expect(sr2.success).toBeFalsy();
    done();
  });

  test("get links by link ids", async (done) => {
    const getResponse = await request(app)
      .get(
        `${service}/list/${testLink.linkId},${testLink2.linkId},${testLink3.linkId}`
      )
      .expect(200)
      .expect("Content-Type", /json/);
    expect(isServiceResponse(getResponse.body)).toBeTruthy();
    const sr: IServiceResponse<{ [linkId: string]: ILink }> = getResponse.body;
    expect(sr.success).toBeTruthy();
    const links = sr.payload;
    expect(Object.keys(links).length).toBe(3);
    expect(links[testLink.linkId].destNodeId).toBe(testLink.destNodeId);
    expect(links[testLink2.linkId].destNodeId).toBe(testLink2.destNodeId);
    expect(links[testLink3.linkId].destNodeId).toBe(testLink3.destNodeId);

    const deleteResponse = await linkDbConnection.deleteLinks([
      testLink.linkId,
      testLink2.linkId,
      testLink3.linkId,
    ]);
    expect(deleteResponse.success).toBeTruthy();

    const getResponse2 = await request(app)
      .get(
        `${service}/list/${testLink.linkId},${testLink2.linkId},${testLink3.linkId}`
      )
      .expect(200)
      .expect("Content-Type", /json/);
    expect(isServiceResponse(getResponse2.body)).toBeTruthy();
    const sr2: IServiceResponse<ILink> = getResponse2.body;
    expect(sr2.success).toBeFalsy();
    done();
  });
});
