import { GridFSBucket } from "mongodb";
import { ILink, ILinkGateway } from "spectacle-interfaces";
import { textChangeRangeIsUnchanged } from "typescript";
import { runInContext } from "vm";
import { brotliCompress } from "zlib";
import DatabaseConnection from "../../dbConfig";
import LinkGateway from "../../gateway/LinkGateway";

describe("Unit Test: Create Link", () => {
  const linkDbConnection = DatabaseConnection;
  const linkGateway: ILinkGateway = new LinkGateway(linkDbConnection);

  beforeEach(async (done) => {
    const response = await linkDbConnection.clearLinkCollection();
    expect(response.success).toBeTruthy();
    done();
  });

//   afterAll(async (done) => {
//     const response = await linkDbConnection.clearLinkCollection();
//     expect(response.success).toBeTruthy();
//     done();
//   });


//   test("doesn't create invalid link", async (done) => {
//     const badlink: any = { id: "id" };
//     const response = await linkGateway.createLink(badlink);
//     expect(response.success).toBeFalsy();
//     done();
//   });

  test("creates valid link between two anchors", async (done) => {
    const validlink: ILink = {
      linkId: "l1",
      srcAnchorId: "a1",
      destAnchorId: "a2"
    };

    const dbInvalidFindResponse = await linkDbConnection.findLink("l1");
    expect(dbInvalidFindResponse.success).toBeFalsy();
    const createResponse = await linkGateway.createLink(validlink);
    expect(createResponse.success).toBeTruthy();
    const dbFindResponse = await linkDbConnection.findLink("l1");
    console.log(dbFindResponse)
    expect(dbFindResponse.success).toBeTruthy();
    expect(dbFindResponse.payload.linkId).toBe("l1");
    expect(dbFindResponse.payload.srcAnchorId).toBe("a1");
    expect(dbFindResponse.payload.destAnchorId).toBe("a2");
    expect(dbFindResponse.payload.srcNodeId).toBe(null);
    expect(dbFindResponse.payload.destNodeId).toBe(null);
    done();
  });

//   test("creates valid link between two nodes", async (done) => {
//     const validlink: ILink = {
//       linkId: "l1",
//       srcNodeId: "n1",
//       destNodeId: "n2"
//     };

//     const dbInvalidFindResponse = await linkDbConnection.findLink("l1");
//     expect(dbInvalidFindResponse.success).toBeFalsy();
//     const createResponse = await linkGateway.createLink(validlink);
//     expect(createResponse.success).toBeTruthy();
//     const dbFindResponse = await linkDbConnection.findLink("l1");
//     expect(dbFindResponse.success).toBeTruthy();
//     expect(dbFindResponse.payload.linkId).toBe("l1");
//     expect(dbFindResponse.payload.srcAnchorId).toBe(undefined);
//     expect(dbFindResponse.payload.destAnchorId).toBe(undefined);
//     expect(dbFindResponse.payload.srcNodeId).toBe("n1");
//     expect(dbFindResponse.payload.destNodeId).toBe("n2");
//     done();
//   });

//   test("creates valid link between anchor -> node ", async (done) => {
//     const validlink: ILink = {
//       linkId: "l1",
//       srcAnchorId: "a1",
//       destNodeId: "n2"
//     };

//     const dbInvalidFindResponse = await linkDbConnection.findLink("l1");
//     expect(dbInvalidFindResponse.success).toBeFalsy();
//     const createResponse = await linkGateway.createLink(validlink);
//     expect(createResponse.success).toBeTruthy();
//     const dbFindResponse = await linkDbConnection.findLink("l1");
//     expect(dbFindResponse.success).toBeTruthy();
//     expect(dbFindResponse.payload.linkId).toBe("l1");
//     expect(dbFindResponse.payload.srcAnchorId).toBe("a1");
//     expect(dbFindResponse.payload.destAnchorId).toBe(undefined);
//     expect(dbFindResponse.payload.srcNodeId).toBe(undefined);
//     expect(dbFindResponse.payload.destNodeId).toBe("n2");
//     done();
//   });

//   test("creates valid link between node -> anchor", async (done) => {
//     const validlink: ILink = {
//       linkId: "l1",
//       destAnchorId: "a2",
//       srcNodeId: "n1"
//     };

//     const dbInvalidFindResponse = await linkDbConnection.findLink("l1");
//     expect(dbInvalidFindResponse.success).toBeFalsy();
//     const createResponse = await linkGateway.createLink(validlink);
//     expect(createResponse.success).toBeTruthy();
//     const dbFindResponse = await linkDbConnection.findLink("l1");
//     expect(dbFindResponse.success).toBeTruthy();
//     expect(dbFindResponse.payload.linkId).toBe("l1");
//     expect(dbFindResponse.payload.srcAnchorId).toBe(undefined);
//     expect(dbFindResponse.payload.destAnchorId).toBe("a2");
//     expect(dbFindResponse.payload.srcNodeId).toBe("n1");
//     expect(dbFindResponse.payload.destNodeId).toBe(undefined);
//     done();
//   });

//   test("creates valid link between two sources", async (done) => {
//     const validlink: ILink = {
//       linkId: "l1",
//       srcAnchorId: "a1",
//       srcNodeId: "n1"
//     };

//     const dbInvalidFindResponse = await linkDbConnection.findLink("l1");
//     expect(dbInvalidFindResponse.success).toBeFalsy();
//     const createResponse = await linkGateway.createLink(validlink);
//     expect(createResponse.success).toBeTruthy();
//     const dbFindResponse = await linkDbConnection.findLink("l1");
//     expect(dbFindResponse.success).toBeTruthy();
//     expect(dbFindResponse.payload.linkId).toBe("l1");
//     expect(dbFindResponse.payload.srcAnchorId).toBe("a1");
//     expect(dbFindResponse.payload.destAnchorId).toBe(undefined);
//     expect(dbFindResponse.payload.srcNodeId).toBe("n1");
//     expect(dbFindResponse.payload.destNodeId).toBe(undefined);
//     done();
//   });

//   test("creates valid link between two destinations", async (done) => {
//     const validlink: ILink = {
//       linkId: "l1",
//       destAnchorId: "a2",
//       destNodeId: "n2"
//     };

//     const dbInvalidFindResponse = await linkDbConnection.findLink("l1");
//     expect(dbInvalidFindResponse.success).toBeFalsy();
//     const createResponse = await linkGateway.createLink(validlink);
//     expect(createResponse.success).toBeTruthy();
//     const dbFindResponse = await linkDbConnection.findLink("l1");
//     expect(dbFindResponse.success).toBeTruthy();
//     expect(dbFindResponse.payload.linkId).toBe("l1");
//     expect(dbFindResponse.payload.srcAnchorId).toBe(undefined);
//     expect(dbFindResponse.payload.destAnchorId).toBe("a2");
//     expect(dbFindResponse.payload.srcNodeId).toBe(undefined);
//     expect(dbFindResponse.payload.destNodeId).toBe("n2");
//     done();
//   });

//   test("creates valid link, fails to create valid link with same id", async (done) => {
//     const validlink: ILink = {
//       linkId: "l1",
//       srcAnchorId: "a1",
//       destAnchorId: "a2",
//       srcNodeId: "n1",
//       destNodeId: "n2",
//     };
//     const createResponse = await linkGateway.createLink(validlink);
//     expect(createResponse.success).toBeTruthy();
//     const dbFindResponse = await linkDbConnection.findLink("l1");
//     expect(dbFindResponse.success).toBeTruthy();
//     expect(dbFindResponse.payload.linkId).toBe("l1");
//     expect(dbFindResponse.payload.srcAnchorId).toBe("a1");
//     expect(dbFindResponse.payload.destAnchorId).toBe("a2");
//     expect(dbFindResponse.payload.srcNodeId).toBe("n1");
//     expect(dbFindResponse.payload.destNodeId).toBe("n2");

//     const duplicateIdLink: ILink = {
//       linkId: "l1",
//       srcAnchorId: "a10",
//       destAnchorId: "a20",
//       srcNodeId: "n10",
//       destNodeId: "n20",
//     };
//     const createResponse2 = await linkGateway.createLink(duplicateIdLink);
//     expect(createResponse2.success).toBeFalsy();
//     const dbFindResponse2 = await linkDbConnection.findLink("l1");
//     expect(dbFindResponse2.success).toBeTruthy();
//     expect(dbFindResponse2.payload.linkId).toBe("l1");
//     expect(dbFindResponse2.payload.srcAnchorId).toBe("a1");
//     expect(dbFindResponse2.payload.destAnchorId).toBe("a2");
//     expect(dbFindResponse2.payload.srcNodeId).toBe("n1");
//     expect(dbFindResponse2.payload.destNodeId).toBe("n2");

//     done();
//   });

//   test("fails to create when fields are invalid", async (done) => {
//     const invalidlink: any = {
//       linkId: "l1",
//       srcAnchorId: null,
//       destAnchorId: "",
//       srcNodeId: undefined,
//       destNodeId: null,
//     };
//     const response = await linkGateway.createLink(invalidlink);
//     expect(response.success).toBeFalsy();
//     const dbInvalidFindResponse = await linkDbConnection.findLink("l1");
//     expect(dbInvalidFindResponse.success).toBeFalsy();

//     const invalidlink2: any = {
//       linkId: "",
//       srcAnchorId: 2,
//       destAnchorId: null,
//       srcNodeId: "",
//       destNodeId: "",
//     };
//     const response2 = await linkGateway.createLink(invalidlink2);
//     expect(response2.success).toBeFalsy();
//     const dbInvalidFindResponse2 = await linkDbConnection.findLink("l1");
//     expect(dbInvalidFindResponse2.success).toBeFalsy();

//     const invalidlink3: any = {
//       linkId: undefined,
//       srcAnchorId: "null",
//       destAnchorId: null,
//       srcNodeId: "2",
//       destNodeId: "2",
//     };
//     const response3 = await linkGateway.createLink(invalidlink3);
//     expect(response3.success).toBeFalsy();
//     const dbInvalidFindResponse3 = await linkDbConnection.findLink("l1");
//     expect(dbInvalidFindResponse3.success).toBeFalsy();
//     done();
//   });

//   test("fails to create link when source and dest anchor are the same", async (done) => {
//     const invalidlink: any = {
//       linkId: "l1",
//       srcAnchorId: "a1",
//       destAnchorId: "a1",
//       srcNodeId: "n1",
//       destNodeId: "n1",
//     };
//     const response = await linkGateway.createLink(invalidlink);
//     expect(response.success).toBeFalsy();
//     const dbInvalidFindResponse = await linkDbConnection.findLink("l1");
//     expect(dbInvalidFindResponse.success).toBeFalsy();
//     done();
//   });
});
