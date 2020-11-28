import { ILink } from 'hypertext-interfaces';
import { generateAnchorId, generateLinkId, generateNodeId } from '../../NodeManager/helpers/generateNodeId';
import LinkGateway from '../LinkGateway';

const nodeId1 = generateNodeId()
const nodeId2 = generateNodeId()
const nodeId3 = generateNodeId()

const anchorId1 = generateAnchorId()
const anchorId2 = generateAnchorId()
const anchorId3 = generateAnchorId()
const anchorId4 = generateAnchorId()

const testLink1: ILink = {
  linkId: generateLinkId(),
  destNodeId: nodeId1,
  destAnchorId: anchorId1,
  srcNodeId: nodeId1,
  srcAnchorId: anchorId2
}

const testLink2: ILink = {
  linkId: generateLinkId(),
  destNodeId: nodeId1,
  destAnchorId: anchorId1,
  srcNodeId: nodeId2,
  srcAnchorId: anchorId3
}

const testLink3: ILink = {
  linkId: generateLinkId(),
  destNodeId: nodeId2,
  destAnchorId: anchorId3,
  srcNodeId: nodeId3,
  srcAnchorId: anchorId4
}

describe('basic link crud', () => {

  beforeAll(async done => {
    let deleteResponse1 = await LinkGateway.deleteLink(testLink1.linkId);
    expect(deleteResponse1.success).toBeTruthy();

    let deleteResponse2 = await LinkGateway.deleteLink(testLink1.linkId);
    expect(deleteResponse2.success).toBeTruthy();

    let deleteResponse3 = await LinkGateway.deleteLink(testLink3.linkId);
    expect(deleteResponse3.success).toBeTruthy();
  
    let getResponse1= await LinkGateway.getLink(testLink1.linkId);
    expect(getResponse1.success).toBeFalsy();

    let getResponse2 = await LinkGateway.getLink(testLink2.linkId);
    expect(getResponse2.success).toBeFalsy();

    let getResponse3 = await LinkGateway.getLink(testLink3.linkId);
    expect(getResponse3.success).toBeFalsy();
    done()
  })
  
  afterAll(async done => {
    let deleteResponse1 = await LinkGateway.deleteLink(testLink1.linkId);
    expect(deleteResponse1.success).toBeTruthy();

    let deleteResponse2 = await LinkGateway.deleteLink(testLink1.linkId);
    expect(deleteResponse2.success).toBeTruthy();

    let deleteResponse3 = await LinkGateway.deleteLink(testLink3.linkId);
    expect(deleteResponse3.success).toBeTruthy();
  
    let getResponse1= await LinkGateway.getLink(testLink1.linkId);
    expect(getResponse1.success).toBeFalsy();

    let getResponse2 = await LinkGateway.getLink(testLink2.linkId);
    expect(getResponse2.success).toBeFalsy();

    let getResponse3 = await LinkGateway.getLink(testLink3.linkId);
    expect(getResponse3.success).toBeFalsy();
    done()
  })

  test('creates link', async done => {
    const response = await LinkGateway.createLink(testLink1);
    expect(response.success).toBeTruthy();

    const response2 = await LinkGateway.createLink(testLink2);
    expect(response2.success).toBeTruthy();

    const response3= await LinkGateway.createLink(testLink3);
    expect(response3.success).toBeTruthy();
    done()
  });

  test('fails to create duplicate link', async done => {
    const response = await LinkGateway.createLink(testLink1);
    expect(response.success).toBeFalsy();

    const response2 = await LinkGateway.createLink(testLink2);
    expect(response2.success).toBeFalsy();
    done()
  });

  test('gets link by id', async done => {
      const response = await LinkGateway.getLink(testLink1.linkId);
      expect(response.success).toBeTruthy();
      expect(response.payload).toStrictEqual(testLink1);

      const response2 = await LinkGateway.getLink(testLink2.linkId);
      expect(response2.success).toBeTruthy();
      expect(response2.payload).toStrictEqual(testLink2);

      const response3 = await LinkGateway.getLink(testLink3.linkId);
      expect(response3.success).toBeTruthy();
      expect(response3.payload).toStrictEqual(testLink3);
      done()
  });

  test('gets links by node', async done => {
    const response = await LinkGateway.getNodeLinks(nodeId2);
    expect(response.success).toBeTruthy();
    expect(Object.keys(response.payload).length).toBe(2);
    const links = response.payload
    expect(links[testLink2.linkId]).toStrictEqual(testLink2);
    expect(links[testLink3.linkId]).toEqual(testLink3);
    done()
  });

  test('gets links by anchor', async done => {
    const response = await LinkGateway.getAnchorLinks(anchorId3);
    expect(response.success).toBeTruthy();
    expect(Object.keys(response.payload).length).toBe(2);
    const links = response.payload
    expect(links[testLink2.linkId]).toStrictEqual(testLink2);
    expect(links[testLink3.linkId]).toEqual(testLink3);
    done()
  });

  test('deletes links', async done => {
    const getResponse = await LinkGateway.getLink(testLink3.linkId);
    expect(getResponse.success).toBeTruthy()

    const deleteResponse = await LinkGateway.deleteLink(testLink3.linkId);
    expect(deleteResponse.success).toBeTruthy();

    const getResponse2 = await LinkGateway.getLink(testLink3.linkId);
    expect(getResponse2.success).toBeFalsy()
    done()
  });

  test('deletes links by anchor', async done => {
    const response = await LinkGateway.getAnchorLinks(anchorId3);
    expect(response.success).toBeTruthy();
    expect(Object.keys(response.payload).length).toBe(1);

    const response2 = await LinkGateway.deleteAnchorLinks(anchorId3);
    expect(response2.success).toBeTruthy();

    const response3 = await LinkGateway.getNodeLinks(anchorId3);
    expect(response3.success).toBeFalsy();
    done()
  });

  test('deletes links by node', async done => {
    const response = await LinkGateway.getNodeLinks(nodeId1);
    expect(response.success).toBeTruthy();
    expect(Object.keys(response.payload).length).toBe(1);

    const response2 = await LinkGateway.deleteNodeLinks(nodeId1);
    expect(response2.success).toBeTruthy();

    const response3 = await LinkGateway.getNodeLinks(nodeId1);
    expect(response3.success).toBeFalsy();
    done()
  });
});