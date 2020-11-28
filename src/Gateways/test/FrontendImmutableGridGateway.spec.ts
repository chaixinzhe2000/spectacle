import { IImmutableGridAnchor, IImmutableGridNode } from 'hypertext-interfaces';
import { generateAnchorId, generateNodeId } from '../../NodeManager/helpers/generateNodeId';
import ImmutableGridAnchorGateway from '../ImmutableGrid/ImmutableGridAnchorGateway';
import ImmutableGridNodeGateway from '../ImmutableGrid/ImmutableGridNodeGateway';


const nodeId = generateNodeId()

describe('basic node crud', () => {

  const testNode: IImmutableGridNode = {
    nodeId: nodeId,
    columns: [{
      key: "x",
      name: "X"
    },
    {
      key: "y",
      name: "Y"
    }],
    rows: [{
      "x": "xvalue",
      "y": "yvalue"
    }]
  }

  beforeAll(async done => {
    let deleteResponse = await ImmutableGridNodeGateway.deleteNode(testNode.nodeId);
    expect(deleteResponse.success).toBeTruthy();
  
    let getResponse = await ImmutableGridNodeGateway.getNode(testNode.nodeId);
    expect(getResponse.success).toBeFalsy();

    done()
  })
  
  afterAll(async done => {
    let deleteResponse = await ImmutableGridNodeGateway.deleteNode(testNode.nodeId);
    expect(deleteResponse.success).toBeTruthy();
  
    let getResponse = await ImmutableGridNodeGateway.getNode(testNode.nodeId);
    expect(getResponse.success).toBeFalsy();

    done()
  })

  test('creates node', async done => {
    const response = await ImmutableGridNodeGateway.createNode(testNode);
    expect(response.success).toBeTruthy();
    done()
  });

  test('gets node', async done => {
      const response = await ImmutableGridNodeGateway.getNode(testNode.nodeId);
      expect(response.success).toBeTruthy();
      expect(response.payload).toStrictEqual(testNode);
      done()
  });

  test('deletes node', async done => {
    const getResponse = await ImmutableGridNodeGateway.getNode(testNode.nodeId);
    expect(getResponse.success).toBeTruthy()

    const deleteResponse = await ImmutableGridNodeGateway.deleteNode(testNode.nodeId);
    expect(deleteResponse.success).toBeTruthy();

    const getResponse2 = await ImmutableGridNodeGateway.getNode(testNode.nodeId);
    expect(getResponse2.success).toBeFalsy()

    done()
  });
});


describe('basic anchor crud', () => {

  const textAnchor: IImmutableGridAnchor = {
    anchorId: generateAnchorId(),
    topLeftCell: {
      row: 0,
      columm: 10
    },
    bottomRightCell: {
      row: 0,
      columm: 10
    }
  }

  const textAnchor2: IImmutableGridAnchor = {
    anchorId: generateAnchorId(),
    topLeftCell: {
      row: 0,
      columm: 10
    },
    bottomRightCell: {
      row: 10,
      columm: 11
    }
  }

  beforeAll(async done => {
    let deleteResponse = await ImmutableGridAnchorGateway.deleteAnchor(textAnchor.anchorId);
    expect(deleteResponse.success).toBeTruthy();
  
    let getResponse = await ImmutableGridAnchorGateway.getAnchor(textAnchor.anchorId);
    expect(getResponse.success).toBeFalsy();

    let deleteResponse2 = await ImmutableGridAnchorGateway.deleteAnchor(textAnchor2.anchorId);
    expect(deleteResponse2.success).toBeTruthy();
  
    let getResponse2 = await ImmutableGridAnchorGateway.getAnchor(textAnchor2.anchorId);
    expect(getResponse2.success).toBeFalsy();
    done()
  })
  
  afterAll(async done => {
    let deleteResponse = await ImmutableGridAnchorGateway.deleteAnchor(textAnchor.anchorId);
    expect(deleteResponse.success).toBeTruthy();
  
    let getResponse = await ImmutableGridAnchorGateway.getAnchor(textAnchor.anchorId);
    expect(getResponse.success).toBeFalsy();

    let deleteResponse2 = await ImmutableGridAnchorGateway.deleteAnchor(textAnchor2.anchorId);
    expect(deleteResponse2.success).toBeTruthy();
  
    let getResponse2 = await ImmutableGridAnchorGateway.getAnchor(textAnchor2.anchorId);
    expect(getResponse2.success).toBeFalsy();
    done()
  })

  test('creates anchor', async done => {
    const response = await ImmutableGridAnchorGateway.createAnchor(textAnchor);
    expect(response.success).toBeTruthy();

    const response2 = await ImmutableGridAnchorGateway.createAnchor(textAnchor2);
    expect(response2.success).toBeTruthy();
    done()
  });

  test('gets anchor', async done => {
      const response = await ImmutableGridAnchorGateway.getAnchor(textAnchor.anchorId);
      expect(response.success).toBeTruthy();
      expect(response.payload).toStrictEqual(textAnchor)

      const response2 = await ImmutableGridAnchorGateway.getAnchor(textAnchor2.anchorId);
      expect(response2.success).toBeTruthy();
      expect(response2.payload).toStrictEqual(textAnchor2)
      done()
  });

  test('gets anchors', async done => {
    const response = await ImmutableGridAnchorGateway.getAnchors([textAnchor.anchorId, textAnchor2.anchorId]);
    expect(response.success).toBeTruthy();
    expect(Object.keys(response.payload).length).toBe(2)
    const anchors = response.payload
    expect(anchors[textAnchor.anchorId]).toStrictEqual(textAnchor)
    expect(anchors[textAnchor2.anchorId]).toStrictEqual(textAnchor2)
    done()
});

  test('deletes anchors', async done => {
    const getResponse = await ImmutableGridAnchorGateway.getAnchor(textAnchor.anchorId);
    expect(getResponse.success).toBeTruthy()

    const getResponse1 = await ImmutableGridAnchorGateway.getAnchor(textAnchor2.anchorId);
    expect(getResponse1.success).toBeTruthy()

    const deleteResponse = await ImmutableGridAnchorGateway.deleteAnchors([textAnchor.anchorId, textAnchor2.anchorId]);
    expect(deleteResponse.success).toBeTruthy();

    const getResponse2 = await ImmutableGridAnchorGateway.getAnchor(textAnchor.anchorId);
    expect(getResponse2.success).toBeFalsy()

    const getResponse3 = await ImmutableGridAnchorGateway.getAnchor(textAnchor2.anchorId);
    expect(getResponse3.success).toBeFalsy()
    done()
  });

  test('deletes anchor', async done => {
    const getResponse = await ImmutableGridAnchorGateway.getAnchor(textAnchor.anchorId);
    if (!getResponse.success) {
      const response = await ImmutableGridAnchorGateway.createAnchor(textAnchor);
      expect(response.success).toBeTruthy();
    }

    const deleteResponse = await ImmutableGridAnchorGateway.deleteAnchor(textAnchor.anchorId);
    expect(deleteResponse.success).toBeTruthy();

    const getResponse2 = await ImmutableGridAnchorGateway.getAnchor(textAnchor.anchorId);
    expect(getResponse2.success).toBeFalsy()
    done()
  });
});