import NodeGateway from '../../gateway/NodeGateway';
import MockMongoDatabaseConnection from '../../database/mongo/mock/MockMongoNodeDatabaseConnection';
import { INodeGateway, newFilePath } from "spectacle-interfaces"
import initTestingTree from '../NodeDatabaseConnection/Mock/initTestingTree';

const dbConnection = new MockMongoDatabaseConnection()

describe('Unit Test: Get Node by Path', () => {
  const nodeGateway: INodeGateway = new NodeGateway(dbConnection)

  beforeAll(async done => {
    const nodes = initTestingTree([{
      id: 'a',
      filePath: ['a']
     },
      {
      id: 'b',
      filePath: ['b']
      },
      {
        id: 'aa',
        filePath: ['a', 'aa']
      },
      {
        id: 'aaa',
        filePath: ['a', 'aa', 'aaa']
    }])
    const initTreeResponse = await dbConnection.initTree(nodes)
    expect(initTreeResponse.success).toBeTruthy()
    done()
  })

  test("doesn't get non-existent node", async done => {
    const getResponse = await nodeGateway.getNodeByPath(newFilePath(['bad_id']))
    expect(getResponse.success).toBeFalsy()
    done()
  })

  test("successfully gets node", async done => {
    const getResponse = await nodeGateway.getNodeByPath(newFilePath(['a']))
    expect(getResponse.success).toBeTruthy()
    expect(getResponse.payload.children.length).toBe(1)
    done()
  })

  test("empty filepath should return the full tree", async done => {
    const getResponse = await nodeGateway.getNodeByPath(newFilePath([]))
    expect(getResponse.success).toBeTruthy()
    expect(getResponse.payload.children.length).toBe(2)
    const a = getResponse.payload.children.find(({ nodeId }) => nodeId === 'a')
    expect(a.filePath.filePath.length).toBe(1)
    expect(a.children[0].filePath.filePath.length).toBe(2)
    expect(a.children[0].children.length).toBe(1)
    done()
  })

  test("successfully gets nested node", async done => {
    const getResponse = await nodeGateway.getNodeByPath(newFilePath(['a', 'aa']))
    expect(getResponse.success).toBeTruthy()
    expect(getResponse.payload.children.length).toBe(1)
    done()
  })

  test("filePath field is in Doucment", async done => {
    const getResponse = await nodeGateway.getNodeByPath(newFilePath(['a']))
    expect(getResponse.success).toBeTruthy()
    expect(getResponse.payload.children.length).toBe(1)
    expect(getResponse.payload.children[0].filePath.filePath.length).toBe(2)
    done()
  })

  test("filePath field is in Doucment", async done => {
    const getResponse = await nodeGateway.getNodeByPath(newFilePath(['aa']))
    expect(getResponse.success).toBeFalsy()
    done()
  })

  test("is false if filepath is invalid", async done => {
    const invalidPath: any = "string"
    const getResponse = await nodeGateway.getNodeByPath(invalidPath)
    expect(getResponse.success).toBeFalsy()
    done()
  })
})

describe('Unit Test: Get Node by Path - Single Root Child Test', () => {
  const nodeGateway: INodeGateway = new NodeGateway(dbConnection)

  beforeAll(async done => {
    const clearResponse = await dbConnection.clearNodeCollection()
    expect(clearResponse.success).toBeTruthy()

    const nodes = initTestingTree([{
        id: 'a',
        filePath: ['a']
      },
      {
        id: 'aa',
        filePath: ['a', 'aa']
      },
      {
        id: 'aaa',
        filePath: ['a', 'aa', 'aaa']
    }])
    const initTreeResponse = await dbConnection.initTree(nodes)
    expect(initTreeResponse.success).toBeTruthy()
    done()
  })

  test("empty filepath should return the full tree", async done => {
    const getResponse = await nodeGateway.getNodeByPath(newFilePath([]))
    expect(getResponse.success).toBeTruthy()
    expect(getResponse.payload.children.length).toBe(1)
    expect(getResponse.payload.children[0].filePath.filePath.length).toBe(1)
    expect(getResponse.payload.children[0].children[0].filePath.filePath.length).toBe(2)
    done()
  })
})

describe('Unit Test: Get Node by Path - Extra Test', () => {
  const nodeGateway: INodeGateway = new NodeGateway(dbConnection)

  beforeAll(async done => {
    const nodes = initTestingTree([{
        id: 'a',
        filePath: ['a']
      },
      {
        id: 'aa',
        filePath: ['a', 'aa']
      },
      {
        id: 'b',
        filePath: ['b']
    },
    {
      id: 'bb',
      filePath: ['b', 'bb']
  }])
    const initTreeResponse = await dbConnection.initTree(nodes)
    expect(initTreeResponse.success).toBeTruthy()
    done()
  })

  test("empty filepath should return the full tree", async done => {
    const getResponse = await nodeGateway.getNodeByPath(newFilePath([]))
    expect(getResponse.success).toBeTruthy()
    expect(getResponse.payload.children.length).toBe(2)
    const a = getResponse.payload.children.find(({ nodeId }) => nodeId === 'a')
    const b = getResponse.payload.children.find(({ nodeId }) => nodeId === 'b')
    expect(a.children.length).toBe(1)
    expect(b.children.length).toBe(1)
    done()
  })
})