import { IServiceResponse, ILink } from "spectacle-interfaces";
import request from "supertest";
import app from "../../app";
import DatabaseConnection from "../../dbConfig";

export function isServiceResponse<T>(sr: any): sr is IServiceResponse<T> {
  return (
    sr.success !== undefined &&
    typeof sr.success === "boolean" &&
    sr.message !== undefined &&
    typeof sr.message === "string" &&
    sr.payload !== undefined
  );
}

const service = "/link";

const testLink: ILink = {
  linkId: "linkx.test",
  srcAnchorId: "srcanchorx.test",
  srcNodeId: "srcnodex.test",
};

describe("Link Router Flow Tests", () => {

  afterAll(async (done) => {
    const response = await DatabaseConnection.clearLinkCollection();
    expect(response.success).toBeTruthy();
    done();
  });

  test("deletes link", async (done) => {
    try {
      const deleteResponse = await request(app)
        .delete(`${service}/${testLink.linkId}`)
        .expect(200)
        .expect("Content-Type", /json/);
      expect(isServiceResponse(deleteResponse.body)).toBeTruthy();
      done();
    } catch {
      done();
    }
  });

  test("creates link", async (done) => {
    const createResponse = await request(app)
      .post(service)
      .send({ data: testLink })
      .expect(200)
      .expect("Content-Type", /json/);
    expect(isServiceResponse(createResponse.body)).toBeTruthy();
    const sr: IServiceResponse<ILink> = createResponse.body;
    expect(sr.success).toBeTruthy();
    done();
  });

  test("gets link", async (done) => {
    const getResponse = await request(app)
      .get(`${service}/linkx.test`)
      .expect(200)
      .expect("Content-Type", /json/);
    expect(isServiceResponse(getResponse.body)).toBeTruthy();
    const sr: IServiceResponse<ILink> = getResponse.body;
    expect(sr.success).toBeTruthy();
    done();
  });

  test("gets link by node", async (done) => {
    const getResponse = await request(app)
      .get(`${service}/node/srcnodex.test`)
      .expect(200)
      .expect("Content-Type", /json/);
    expect(isServiceResponse(getResponse.body)).toBeTruthy();
    const sr: IServiceResponse<{ [linkId: string]: ILink }> = getResponse.body;
    expect(sr.success).toBeTruthy();
    expect(sr.payload).toBeDefined();
    expect(Object.keys(sr.payload).length).toBe(1);

    const getResponse2 = await request(app)
      .get(`${service}/node/destnodex.test`)
      .expect(200)
      .expect("Content-Type", /json/);
    expect(isServiceResponse(getResponse2.body)).toBeTruthy();
    const sr2: IServiceResponse<{ [linkId: string]: ILink }> =
      getResponse2.body;
    expect(sr2.success).toBeTruthy();
    expect(sr2.payload).toBeDefined();
    expect(Object.keys(sr2.payload).length).toBe(1);
    done();
  });

  test("gets link by anchor", async (done) => {
    const getResponse = await request(app)
      .get(`${service}/anchor/srcanchorx.test`)
      .expect(200)
      .expect("Content-Type", /json/);
    expect(isServiceResponse(getResponse.body)).toBeTruthy();
    const sr: IServiceResponse<{ [linkId: string]: ILink }> = getResponse.body;
    expect(sr.success).toBeTruthy();
    expect(sr.payload).toBeDefined();
    expect(Object.keys(sr.payload).length).toBe(1);

    const getResponse2 = await request(app)
      .get(`${service}/anchor/srcanchorx.test`)
      .expect(200)
      .expect("Content-Type", /json/);
    expect(isServiceResponse(getResponse2.body)).toBeTruthy();
    const sr2: IServiceResponse<{ [linkId: string]: ILink }> =
      getResponse2.body;
    expect(sr2.success).toBeTruthy();
    expect(sr2.payload).toBeDefined();
    expect(Object.keys(sr2.payload).length).toBe(1);
    done();
  });

  test("deletes link", async (done) => {
    const deleteResponse2 = await request(app)
      .delete(`${service}/linkx.test`)
      .expect(200)
      .expect("Content-Type", /json/);
    expect(isServiceResponse(deleteResponse2.body)).toBeTruthy();
    const sr: IServiceResponse<ILink> = deleteResponse2.body;
    expect(sr.success).toBeTruthy();
    done();
  });

  test("shouldn't get link", async (done) => {
    const getResponse = await request(app)
      .get(`${service}/linkx.test`)
      .expect("Content-Type", /json/)
      .expect(200);
    expect(isServiceResponse(getResponse.body)).toBeTruthy();
    const sr: IServiceResponse<ILink> = getResponse.body;
    expect(sr.success).toBeFalsy();
    done();
  });
});
