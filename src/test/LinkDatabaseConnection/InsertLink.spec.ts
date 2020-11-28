import DatabaseConnection from "../../dbConfig";

describe("Insert Link", () => {
  const linkDbConnection = DatabaseConnection;

  beforeEach(async (done) => {
    const response = await linkDbConnection.clearLinkCollection();
    expect(response.success).toBeTruthy();
    done();
  });

  afterAll(async (done) => {
    const response = await linkDbConnection.clearLinkCollection();
    expect(response.success).toBeTruthy();
    done();
  });

  test("doesn't insert invalid links", async (done) => {
    let invalidLink: any = {
      linkId: "l1",
      srcAnchorId: "a1",
      invalidField: "a2",
      srcNodeId: "n1",
      destNodeId: "n2",
    };
    const response = await linkDbConnection.insertLink(invalidLink);
    expect(response.success).toBeFalsy();

    let invalidLink2: any = {
      linkId: "",
      srcAnchorId: "a1",
      destAnchorId: "a2",
      srcNodeId: "",
      destNodeId: "n2",
    };
    const response2 = await linkDbConnection.insertLink(invalidLink2);
    expect(response2.success).toBeFalsy();

    let invalidLink3: any = {
      linkId: "l1",
      srcAnchorId: undefined,
      destAnchorId: "a2",
      srcNodeId: "",
      destNodeId: "n2",
    };
    const response3 = await linkDbConnection.insertLink(invalidLink3);
    expect(response3.success).toBeFalsy();
    done();
  });

  test("inserts links", async (done) => {
    let validLink: any = {
      linkId: "l1",
      srcAnchorId: "a1",
      destAnchorId: "a2",
      srcNodeId: "n1",
      destNodeId: "n2",
    };
    const insertResponse = await linkDbConnection.insertLink(validLink);
    expect(insertResponse.success).toBeTruthy();

    let validLink2: any = {
      linkId: "l2",
      srcAnchorId: "a1",
      destAnchorId: "a2",
      srcNodeId: "n1",
      destNodeId: "n2",
    };
    const insertResponse2 = await linkDbConnection.insertLink(validLink2);
    expect(insertResponse2.success).toBeTruthy();
    done();
  });

  test("doesn't create duplicate links", async (done) => {
    let validLink: any = {
      linkId: "l1",
      srcAnchorId: "a2",
      destAnchorId: "a1",
      srcNodeId: "n2",
      destNodeId: "n1",
    };
    const insertResponse = await linkDbConnection.insertLink(validLink);
    expect(insertResponse.success).toBeTruthy();
    const insertResponse2 = await linkDbConnection.insertLink(validLink);
    expect(insertResponse2.success).toBeFalsy();
    done();
  });

  test("fails on null", async (done) => {
    const response = await linkDbConnection.insertLink(null);
    expect(response.success).toBeFalsy();
    done();
  });
});
