import { IImmutableTextAnchor, IImmutableTextNode } from 'hypertext-interfaces';
import { generateAnchorId, generateNodeId } from '../../NodeManager/helpers/generateNodeId';
import ImmutableTextAnchorGateway from '../ImmutableText/ImmutableTextAnchorGateway';
import ImmutableTextNodeGateway from '../ImmutableText/ImmutableTextNodeGateway';


describe('basic node crud', () => {

  const testNode: IImmutableTextNode = {
    nodeId: generateNodeId(),
    text: 'test.root'
  }

  beforeAll(async done => {
    let deleteResponse = await ImmutableTextNodeGateway.deleteNode(testNode.nodeId);
    expect(deleteResponse.success).toBeTruthy();
  
    let getResponse = await ImmutableTextNodeGateway.getNode(testNode.nodeId);
    expect(getResponse.success).toBeFalsy();

    done()
  })
  
  afterAll(async done => {
    let deleteResponse = await ImmutableTextNodeGateway.deleteNode(testNode.nodeId);
    expect(deleteResponse.success).toBeTruthy();
  
    let getResponse = await ImmutableTextNodeGateway.getNode(testNode.nodeId);
    expect(getResponse.success).toBeFalsy();

    done()
  })

  test('creates node', async done => {
    const response = await ImmutableTextNodeGateway.createNode(testNode);
    expect(response.success).toBeTruthy();
    done()
  });

  test('gets node', async done => {
      const response = await ImmutableTextNodeGateway.getNode(testNode.nodeId);
      expect(response.success).toBeTruthy();
      expect(response.payload.nodeId).toEqual(testNode.nodeId);
      expect(response.payload.text).toEqual(testNode.text);
      done()
  });

  test('deletes node', async done => {
    const getResponse = await ImmutableTextNodeGateway.getNode(testNode.nodeId);
    expect(getResponse.success).toBeTruthy()

    const deleteResponse = await ImmutableTextNodeGateway.deleteNode(testNode.nodeId);
    expect(deleteResponse.success).toBeTruthy();

    const getResponse2 = await ImmutableTextNodeGateway.getNode(testNode.nodeId);
    expect(getResponse2.success).toBeFalsy()

    done()
  });
});


describe('basic anchor crud', () => {

  const textAnchor: IImmutableTextAnchor = {
    anchorId: generateAnchorId(),
    start: 0,
    end: 10
  }

  const textAnchor2: IImmutableTextAnchor = {
    anchorId: generateAnchorId(),
    start: 10,
    end: 230
  } 

  beforeAll(async done => {
    let deleteResponse = await ImmutableTextAnchorGateway.deleteAnchor(textAnchor.anchorId);
    expect(deleteResponse.success).toBeTruthy();
  
    let getResponse = await ImmutableTextAnchorGateway.getAnchor(textAnchor.anchorId);
    expect(getResponse.success).toBeFalsy();

    let deleteResponse2 = await ImmutableTextAnchorGateway.deleteAnchor(textAnchor2.anchorId);
    expect(deleteResponse2.success).toBeTruthy();
  
    let getResponse2 = await ImmutableTextAnchorGateway.getAnchor(textAnchor2.anchorId);
    expect(getResponse2.success).toBeFalsy();
    done()
  })
  
  afterAll(async done => {
    let deleteResponse = await ImmutableTextAnchorGateway.deleteAnchor(textAnchor.anchorId);
    expect(deleteResponse.success).toBeTruthy();
  
    let getResponse = await ImmutableTextAnchorGateway.getAnchor(textAnchor.anchorId);
    expect(getResponse.success).toBeFalsy();

    let deleteResponse2 = await ImmutableTextAnchorGateway.deleteAnchor(textAnchor2.anchorId);
    expect(deleteResponse2.success).toBeTruthy();
  
    let getResponse2 = await ImmutableTextAnchorGateway.getAnchor(textAnchor2.anchorId);
    expect(getResponse2.success).toBeFalsy();
    done()
  })

  test('creates anchor', async done => {
    const response = await ImmutableTextAnchorGateway.createAnchor(textAnchor);
    expect(response.success).toBeTruthy();

    const response2 = await ImmutableTextAnchorGateway.createAnchor(textAnchor2);
    expect(response2.success).toBeTruthy();
    done()
  });

  test('gets anchor', async done => {
      const response = await ImmutableTextAnchorGateway.getAnchor(textAnchor.anchorId);
      expect(response.success).toBeTruthy();
      expect(response.payload).toStrictEqual(textAnchor)

      const response2 = await ImmutableTextAnchorGateway.getAnchor(textAnchor2.anchorId);
      expect(response2.success).toBeTruthy();
      expect(response2.payload).toStrictEqual(textAnchor2)
      done()
  });

  test('deletes anchors', async done => {
    const getResponse = await ImmutableTextAnchorGateway.getAnchor(textAnchor.anchorId);
    expect(getResponse.success).toBeTruthy()

    const getResponse1 = await ImmutableTextAnchorGateway.getAnchor(textAnchor2.anchorId);
    expect(getResponse1.success).toBeTruthy()

    const deleteResponse = await ImmutableTextAnchorGateway.deleteAnchors([textAnchor.anchorId, textAnchor2.anchorId]);
    expect(deleteResponse.success).toBeTruthy();

    const getResponse2 = await ImmutableTextAnchorGateway.getAnchor(textAnchor.anchorId);
    expect(getResponse2.success).toBeFalsy()

    const getResponse3 = await ImmutableTextAnchorGateway.getAnchor(textAnchor2.anchorId);
    expect(getResponse3.success).toBeFalsy()
    done()
  });

  test('deletes anchor', async done => {
    const getResponse = await ImmutableTextAnchorGateway.getAnchor(textAnchor.anchorId);
    if (!getResponse.success) {
      const response = await ImmutableTextAnchorGateway.createAnchor(textAnchor);
      expect(response.success).toBeTruthy();
    }

    const deleteResponse = await ImmutableTextAnchorGateway.deleteAnchor(textAnchor.anchorId);
    expect(deleteResponse.success).toBeTruthy();

    const getResponse2 = await ImmutableTextAnchorGateway.getAnchor(textAnchor.anchorId);
    expect(getResponse2.success).toBeFalsy()
    done()
  });
});