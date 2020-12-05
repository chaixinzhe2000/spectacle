import { IServiceResponse, ILink } from "spectacle-interfaces";
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

const testLink2: ILink = {
  linkId: "linkx.1",
  srcAnchorId: "srcanchorx.test",
  destAnchorId: "destanchorx.1",
  srcNodeId: "srcnodex.test",
  destNodeId: "destnodex.1",
};

const testLink3: ILink = {
  linkId: "linkx.2",
  srcAnchorId: "srcanchorx.2",
  destAnchorId: "destanchorx.2",
  srcNodeId: "srcnodex.2",
  destNodeId: "destnodex.2",
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
    expect(sr.payload).toStrictEqual(testLink);

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
      .get(`${service}/node/${testLink.srcNodeId}`)
      .expect(200)
      .expect("Content-Type", /json/);
    expect(isServiceResponse(getResponse.body)).toBeTruthy();
    const sr: IServiceResponse<{ [linkId: string]: ILink }> = getResponse.body;
    expect(sr.success).toBeTruthy();
    expect(sr.payload).toBeDefined();
    expect(Object.keys(sr.payload).length).toBe(2);
    expect(sr.payload[testLink.linkId]).toStrictEqual(testLink);
    expect(sr.payload[testLink2.linkId]).toStrictEqual(testLink2);

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
    expect(Object.keys(sr.payload).length).toBe(2);
    expect(sr.payload[testLink.linkId]).toStrictEqual(testLink);
    expect(sr.payload[testLink2.linkId]).toStrictEqual(testLink2);

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
    expect(links[testLink.linkId]).toStrictEqual(testLink);
    expect(links[testLink2.linkId]).toStrictEqual(testLink2);
    expect(links[testLink3.linkId]).toStrictEqual(testLink3);

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
