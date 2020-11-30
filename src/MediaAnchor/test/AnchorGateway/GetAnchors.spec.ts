import { IMediaAnchorGateway, IMediaAnchor } from "apposition-interfaces";
import MediaAnchorGateway from '../../gateway/MediaAnchorGateway';
import AnchorDatabaseConnection from "../../dbConfig";

const anchor1: IMediaAnchor = {
    anchorId: 'a',
    mediaTimeStamp: 10
  }
  
  const anchor2: IMediaAnchor = {
    anchorId: 'b',
    mediaTimeStamp: 20
  }
  
  const anchor3: IMediaAnchor = {
    anchorId: 'c',
    mediaTimeStamp: 30
  }

describe("Unit Test: Get Anchors", () => {
  const anchorGateway: IMediaAnchorGateway = new MediaAnchorGateway(
    AnchorDatabaseConnection
  );

  beforeAll(async (done) => {
    const response = await AnchorDatabaseConnection.clearAnchorCollection();
    expect(response.success).toBeTruthy();

    const createResponse = await AnchorDatabaseConnection.initAnchors([
      anchor1,
      anchor2,
      anchor3,
    ]);
    expect(createResponse.success).toBeTruthy();
    done();
  });

  afterAll(async (done) => {
    const response = await AnchorDatabaseConnection.clearAnchorCollection();
    expect(response.success).toBeTruthy();
    done();
  });

  test("doesn't get non-existent anchor", async (done) => {
    const getResponse = await anchorGateway.getAnchors(["bad_id"]);
    expect(getResponse.success).toBeFalsy();
    done();
  });

  test("successfully gets anchor", async (done) => {
    const getResponse = await anchorGateway.getAnchors([
      anchor1.anchorId,
      anchor2.anchorId,
    ]);
    expect(getResponse.success).toBeTruthy();
    expect(Object.keys(getResponse.payload).length).toBe(2);
    const anchors = getResponse.payload;
    expect(anchors["a"]).toStrictEqual(anchor1);
    expect(anchors["b"]).toStrictEqual(anchor2);
    done();
  });

  test("successfully gets anchor", async (done) => {
    const getResponse = await anchorGateway.getAnchors([
      anchor3.anchorId,
      "invalid",
    ]);
    expect(getResponse.success).toBeTruthy();
    expect(Object.keys(getResponse.payload).length).toBe(1);
    const anchors = getResponse.payload;
    expect(anchors["c"]).toStrictEqual(anchor3);
    done();
  });
});
