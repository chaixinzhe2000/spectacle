import { IAnchor, IAnchorGateway } from 'hypertext-interfaces';
import { generateAnchorId, generateNodeId } from '../../NodeManager/helpers/generateNodeId';
import AnchorGateway from '../AnchorGateway';
const anchorGateway: IAnchorGateway = AnchorGateway

const nodeId = generateNodeId()
const nodeId2 = generateNodeId()

const anchorId1 = generateAnchorId()
const anchorId2 = generateAnchorId()
const anchorId3 = generateAnchorId()

const testAnchor: IAnchor = {
  nodeId: nodeId,
  anchorId: anchorId1,
  label: 'label.1',
  type: 'node'
}

const testAnchor2: IAnchor = {
  nodeId: nodeId,
  anchorId: anchorId2,
  label: 'label.2',
  type: 'node'
}

const testAnchor3: IAnchor = {
  nodeId: nodeId2,
  anchorId: anchorId3,
  label: 'label.3',
  type: 'node'
}

describe('basic anchor crud', () => {

  beforeAll(async done => {
    let deleteResponse = await anchorGateway.deleteNodeAnchors(testAnchor.nodeId);
    expect(deleteResponse.success).toBeTruthy();

    let deleteResponse2 = await anchorGateway.deleteAnchor(testAnchor3.anchorId);
    expect(deleteResponse2.success).toBeTruthy();
  
    let getResponse1= await anchorGateway.getAnchor(testAnchor.anchorId);
    expect(getResponse1.success).toBeFalsy();

    let getResponse2 = await anchorGateway.getAnchor(testAnchor2.anchorId);
    expect(getResponse2.success).toBeFalsy();

    let getResponse3 = await anchorGateway.getAnchor(testAnchor3.anchorId);
    expect(getResponse3.success).toBeFalsy();
    done()
  })
  
  afterAll(async done => {
    let deleteResponse = await anchorGateway.deleteNodeAnchors(testAnchor.nodeId);
    expect(deleteResponse.success).toBeTruthy();

    let deleteResponse2 = await anchorGateway.deleteAnchor(testAnchor3.anchorId);
    expect(deleteResponse2.success).toBeTruthy();
  
    let getResponse1= await anchorGateway.getAnchor(testAnchor.anchorId);
    expect(getResponse1.success).toBeFalsy();

    let getResponse2 = await anchorGateway.getAnchor(testAnchor2.anchorId);
    expect(getResponse2.success).toBeFalsy();

    let getResponse3 = await anchorGateway.getAnchor(testAnchor3.anchorId);
    expect(getResponse3.success).toBeFalsy();
    done()
  })

  test('creates anchor', async done => {
    const response = await anchorGateway.createAnchor(testAnchor);
    expect(response.success).toBeTruthy();

    const response2 = await anchorGateway.createAnchor(testAnchor2);
    expect(response2.success).toBeTruthy();

    const response3= await anchorGateway.createAnchor(testAnchor3);
    expect(response3.success).toBeTruthy();
    done()
  });

  test('fails to create duplicate anchor', async done => {
    const response = await anchorGateway.createAnchor(testAnchor);
    expect(response.success).toBeFalsy();

    const response2 = await anchorGateway.createAnchor(testAnchor2);
    expect(response2.success).toBeFalsy();
    done()
  });

  test('gets anchor by id', async done => {
      const response = await anchorGateway.getAnchor(testAnchor.anchorId);
      expect(response.success).toBeTruthy();
      expect(response.payload.nodeId).toEqual(testAnchor.nodeId);
      expect(response.payload.anchorId).toEqual(testAnchor.anchorId);
      done()
  });

  test('gets anchors by node', async done => {
    const response = await anchorGateway.getNodeAnchors(testAnchor.nodeId);
    expect(response.success).toBeTruthy();
    expect(Object.keys(response.payload).length).toBe(2);
    const anchors = response.payload
    expect(anchors[testAnchor.anchorId].anchorId).toEqual(testAnchor.anchorId);
    expect(anchors[testAnchor.anchorId].nodeId).toEqual(testAnchor.nodeId);
    expect(anchors[testAnchor.anchorId].label).toEqual(testAnchor.label);
    expect(anchors[testAnchor2.anchorId].anchorId).toEqual(testAnchor2.anchorId);
    expect(anchors[testAnchor2.anchorId].nodeId).toEqual(testAnchor2.nodeId);
    expect(anchors[testAnchor2.anchorId].label).toEqual(testAnchor2.label);    
    done()
  });

  test('deletes node', async done => {
    const getResponse = await anchorGateway.getAnchor(testAnchor3.anchorId);
    expect(getResponse.success).toBeTruthy()

    const deleteResponse = await anchorGateway.deleteAnchor(testAnchor3.anchorId);
    expect(deleteResponse.success).toBeTruthy();

    const getResponse2 = await anchorGateway.getAnchor(testAnchor3.anchorId);
    expect(getResponse2.success).toBeFalsy()
    done()
  });

  test('deletes anchors by node', async done => {
    const response = await anchorGateway.getNodeAnchors(testAnchor.nodeId);
    expect(response.success).toBeTruthy();
    expect(Object.keys(response.payload).length).toBe(2);

    const response2 = await anchorGateway.deleteNodeAnchors(testAnchor.nodeId);
    expect(response2.success).toBeTruthy();

    const response3 = await anchorGateway.getNodeAnchors(testAnchor.nodeId);
    expect(response3.success).toBeFalsy();
    done()
  });
});