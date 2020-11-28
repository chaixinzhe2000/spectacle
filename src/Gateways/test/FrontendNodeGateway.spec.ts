import NodeGateway from '../NodeGateway';
import { INode, INodeGateway, newFilePath, IServiceResponse } from "hypertext-interfaces"
import { generateNodeId } from '../../NodeManager/helpers/generateNodeId';

const nodeGateway: INodeGateway = NodeGateway

const nodeId = generateNodeId()

const testNode: INode = {
  nodeId: nodeId,
  label: 'test.root',
  filePath: newFilePath([nodeId]),
  nodeType: 'node',
  children: []
}

describe('basic node crud', () => {

  beforeAll(async done => {

    // create folder should be successful
    let deleteResponse = await nodeGateway.deleteNode(testNode.nodeId);
    expect(deleteResponse.success).toBeTruthy();
  
    let getResponse = await nodeGateway.getNode(testNode.nodeId);
    expect(getResponse.success).toBeFalsy();

    done()
  })
  
  afterAll(async done => {
  
    // create folder should be successful
    let deleteResponse = await nodeGateway.deleteNode(testNode.nodeId);
    expect(deleteResponse.success).toBeTruthy();
  
    let getResponse = await nodeGateway.getNode(testNode.nodeId);
    expect(getResponse.success).toBeFalsy();

    done()
  })

  test('creates node', async done => {
    const response = await nodeGateway.createNode(testNode);
    expect(response.success).toBeTruthy();

    done()
  });

  test('gets node', async done => {
      const response = await nodeGateway.getNode(testNode.nodeId);
      expect(response.success).toBeTruthy();
      expect(response.payload.nodeId).toEqual(testNode.nodeId);
      expect(response.payload.label).toEqual(testNode.label);

      done()
  });

  test('updates node', async done => {
    let updatedNode = { ...testNode }
    updatedNode.label = 'updated test'

    const updateResponse = await nodeGateway.updateNode(updatedNode)
    expect(updateResponse.success).toBeTruthy();
    expect(updateResponse.payload.nodeId).toEqual(updatedNode.nodeId);
    expect(updateResponse.payload.label).toEqual(updatedNode.label);

    const getResponse = await nodeGateway.getNode(updatedNode.nodeId);
    expect(getResponse.success).toBeTruthy();
    expect(getResponse.payload.nodeId).toEqual(updatedNode.nodeId);
    expect(getResponse.payload.label).toEqual(updatedNode.label);

    done()
  });

  test('deletes node', async done => {
    const deleteResponse = await nodeGateway.deleteNode(testNode.nodeId);
    expect(deleteResponse.success).toBeTruthy();

    const getResponse = await nodeGateway.getNode(testNode.nodeId);
    expect(getResponse.success).toBeFalsy()

    done()
  });
});

describe('basic file structure', () => {

  const nodeId1 = generateNodeId()
  const nodeId2 = generateNodeId()
  const nodeId3 = generateNodeId()
  const nodeId4 = generateNodeId()

  const testFolder: INode = {
    nodeId: nodeId1,
    filePath: newFilePath([nodeId1]),
    label: 'Test Folder',
    nodeType: "node",
    children: []
  }

  const testFolder2: INode = {
    nodeId: nodeId2,
    filePath: newFilePath([nodeId1, nodeId2]),
    label: 'Test2 Folder',
    nodeType: "node",
    children: []
  }

  const testNode: INode = {
    nodeId: nodeId3,
    filePath: newFilePath([nodeId1, nodeId3]),
    label: 'Test Node',
    nodeType: "node",
    children: []
  }

  const nestedNode: INode = {
    nodeId: nodeId4,
    filePath: newFilePath([nodeId1, nodeId2, nodeId4]),
    label: 'Test Nested Node',
    nodeType: "node",
    children: []
  }

  beforeAll(async done => {
    
    let deleteResponse = await nodeGateway.deleteNode(testFolder.nodeId);
    expect(deleteResponse.success).toBeTruthy();

    let deleteResponse1 = await nodeGateway.deleteNode(testFolder2.nodeId);
    expect(deleteResponse1.success).toBeTruthy();

    let deleteResponse2 = await nodeGateway.deleteNode(testNode.nodeId);
    expect(deleteResponse2.success).toBeTruthy();

    let deleteResponse3 = await nodeGateway.deleteNode(nestedNode.nodeId);
    expect(deleteResponse3.success).toBeTruthy();

    // create folder should be successful
    let createResponse1 = await nodeGateway.createNode(testFolder);
    let createResponse2 = await nodeGateway.createNode(testFolder2);
    let createResponse3 = await nodeGateway.createNode(testNode);
    let createResponse4 = await nodeGateway.createNode(nestedNode);
    
    // get should be successful and contain new folder
    let getResponse = await nodeGateway.getNodeByPath(testFolder.filePath);
    expect(getResponse.success).toBeTruthy();

    let getResponse2 = await nodeGateway.getNodeByPath(testFolder2.filePath);
    expect(getResponse2.success).toBeTruthy();

    let getResponse3 = await nodeGateway.getNodeByPath(testNode.filePath);
    expect(getResponse3.success).toBeTruthy();

    let getResponse4 = await nodeGateway.getNodeByPath(nestedNode.filePath);
    expect(getResponse4.success).toBeTruthy();

    // testing file structure:
    // test
    //   | - testnode
    //   | - test2
    //         | - nested-node
  
    done()
  })

  afterAll(async done => {
    let deleteResponse = await nodeGateway.deleteNode(testFolder.nodeId);
    expect(deleteResponse.success).toBeTruthy();

    let deleteResponse1 = await nodeGateway.deleteNode(testFolder2.nodeId);
    expect(deleteResponse1.success).toBeTruthy();

    let deleteResponse2 = await nodeGateway.deleteNode(testNode.nodeId);
    expect(deleteResponse2.success).toBeTruthy();

    let deleteResponse3 = await nodeGateway.deleteNode(nestedNode.nodeId);
    expect(deleteResponse3.success).toBeTruthy();
    
    // get should be successful and contain new folder
    let getResponse = await nodeGateway.getNode(testFolder.nodeId);
    expect(getResponse.success).toBeFalsy();

    let getResponse2 = await nodeGateway.getNode(testFolder2.nodeId);
    expect(getResponse2.success).toBeFalsy();

    let getResponse3 = await nodeGateway.getNode(testNode.nodeId);
    expect(getResponse3.success).toBeFalsy();

    let getResponse4 = await nodeGateway.getNode(nestedNode.nodeId);
    expect(getResponse4.success).toBeFalsy();

    done()
  })

  test('gets file tree', async done => {

    let response: IServiceResponse<INode> = await nodeGateway.getNodeByPath(newFilePath([nodeId1]));

    expect(response.success).toBeTruthy();
    expect(response.payload.nodeId).toEqual(nodeId1);
    expect(response.payload.children.length).toEqual(2);

    let response2: IServiceResponse<INode> = await nodeGateway.getNodeByPath(newFilePath([nodeId1, nodeId2]));
    expect(response2.success).toBeTruthy();
    expect(response2.payload.nodeId).toEqual(nodeId2);
    expect(response2.payload.children.length).toEqual(1);

    let response3: IServiceResponse<INode> = await nodeGateway.getNodeByPath(newFilePath([nodeId1, nodeId3]));
    expect(response3.success).toBeTruthy();
    expect(response3.payload.nodeId).toEqual(nodeId3);
    expect(response3.payload.children.length).toEqual(0);
    
    done()
  });

  test('moves folder in tree', async done => {

    // get should be successful and contain new folder
    let getResponse1 = await nodeGateway.getNodeByPath(newFilePath([nodeId1, nodeId2]));
    expect(getResponse1.success).toBeTruthy();
    expect(getResponse1.payload.children.length).toEqual(1);
    expect(getResponse1.payload.children[0].nodeId).toEqual(nestedNode.nodeId);

    let getResponse2 = await nodeGateway.getNodeByPath(newFilePath([nodeId1, nodeId3]));
    expect(getResponse2.success).toBeTruthy();
    expect(getResponse2.payload.children.length).toEqual(0);
    expect(getResponse2.payload.nodeId).toEqual(testNode.nodeId);

    let moveResponse = await nodeGateway.moveNode(
      newFilePath([nodeId1, nodeId3]),
      newFilePath([nodeId1, nodeId2, nodeId3])
    );
    expect(moveResponse.success).toBeTruthy();

    // get should be successful and contain new folder
    let getResponse3 = await nodeGateway.getNodeByPath(newFilePath([nodeId1, nodeId2]));
    expect(getResponse3.success).toBeTruthy();
    expect(getResponse3.payload.children.length).toEqual(2);

    done()
  })
})