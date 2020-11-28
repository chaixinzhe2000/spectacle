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

describe("Unit Test: Delete Link Request", () => {
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
    done();
  });
  
  test("delete link by link id", async (done) => {
    const getResponse1 = await linkDbConnection.findLink(testLink.linkId);
    expect(getResponse1.success).toBeTruthy();
    expect(getResponse1.payload.linkId).toBe(testLink.linkId);
    expect(getResponse1.payload.srcAnchorId).toBe(testLink.srcAnchorId);
    expect(getResponse1.payload.destAnchorId).toBe(testLink.destAnchorId);
    expect(getResponse1.payload.srcNodeId).toBe(testLink.srcNodeId);
    expect(getResponse1.payload.destNodeId).toBe(testLink.destNodeId);

    const deleteResponse = await request(app)
      .delete(`${service}/linkx.test`)
      .expect(200)
      .expect("Content-Type", /json/);
    expect(isServiceResponse(deleteResponse.body)).toBeTruthy();
    const sr: IServiceResponse<{}> = deleteResponse.body;
    expect(sr.success).toBeTruthy();

    const getResponse2 = await linkDbConnection.findLink(testLink.linkId);
    expect(getResponse2.success).toBeFalsy();

    const clearResponse2 = await linkDbConnection.clearLinkCollection();
    expect(clearResponse2.success).toBeTruthy();
    done();
  });

  test("delete links by node id", async (done) => {
    const getResponse1 = await DatabaseConnection.findLinks([
      testLink.linkId,
      testLink2.linkId,
      testLink3.linkId,
    ]);
    expect(getResponse1.success).toBeTruthy();
    const links = getResponse1.payload;
    expect(Object.keys(links).length).toBe(3);
    expect(links[testLink.linkId]).toStrictEqual(testLink);
    expect(links[testLink2.linkId]).toStrictEqual(testLink2);
    expect(links[testLink3.linkId]).toStrictEqual(testLink3);

    const deleteResponse = await request(app)
      .delete(`${service}/node/${testLink.srcNodeId}`)
      .expect(200)
      .expect("Content-Type", /json/);
    expect(isServiceResponse(deleteResponse.body)).toBeTruthy();
    const sr: IServiceResponse<{}> = deleteResponse.body;
    expect(sr.success).toBeTruthy();

    const getResponse2 = await DatabaseConnection.findLinks([
      testLink.linkId,
      testLink2.linkId,
      testLink3.linkId,
    ]);
    expect(getResponse2.success).toBeTruthy();
    const links2 = getResponse2.payload;
    expect(Object.keys(links2).length).toBe(1);
    expect(links2[testLink3.linkId]).toStrictEqual(testLink3);
    expect(links2[testLink2.linkId]).toBe(undefined);
    expect(links2[testLink.linkId]).toBe(undefined);
    done();
  });

  test("delete links by anchor id", async (done) => {
    const getResponse1 = await DatabaseConnection.findLinks([
      testLink.linkId,
      testLink2.linkId,
      testLink3.linkId,
    ]);
    expect(getResponse1.success).toBeTruthy();
    const links = getResponse1.payload;
    expect(Object.keys(links).length).toBe(3);
    expect(links[testLink.linkId]).toStrictEqual(testLink);
    expect(links[testLink2.linkId]).toStrictEqual(testLink2);
    expect(links[testLink3.linkId]).toStrictEqual(testLink3);

    const deleteResponse = await request(app)
      .delete(`${service}/anchor/${testLink.srcAnchorId}`)
      .expect(200)
      .expect("Content-Type", /json/);
    expect(isServiceResponse(deleteResponse.body)).toBeTruthy();
    const sr: IServiceResponse<{}> = deleteResponse.body;
    expect(sr.success).toBeTruthy();

    const getResponse2 = await DatabaseConnection.findLinks([
      testLink.linkId,
      testLink2.linkId,
      testLink3.linkId,
    ]);
    expect(getResponse2.success).toBeTruthy();
    const links2 = getResponse2.payload;
    expect(Object.keys(links2).length).toBe(1);
    expect(links2[testLink3.linkId]).toStrictEqual(testLink3);
    expect(links2[testLink2.linkId]).toBe(undefined);
    expect(links2[testLink.linkId]).toBe(undefined);
    done();
  });

  test("delete links by link ids", async (done) => {
    const getResponse1 = await linkDbConnection.findLink(testLink.linkId);
    expect(getResponse1.success).toBeTruthy();
    expect(getResponse1.payload).toStrictEqual(testLink);

    const deleteResponse = await request(app)
      .delete(
        `${service}/list/${testLink.linkId},${testLink2.linkId},${testLink3.linkId}`
      )
      .expect(200)
      .expect("Content-Type", /json/);
    expect(isServiceResponse(deleteResponse.body)).toBeTruthy();
    const sr: IServiceResponse<{}> = deleteResponse.body;
    expect(sr.success).toBeTruthy();

    const getResponse2 = await linkDbConnection.findLinks([
      testLink.linkId,
      testLink2.linkId,
      testLink3.linkId,
    ]);
    expect(getResponse2.success).toBeFalsy();

    done();
  });
});
