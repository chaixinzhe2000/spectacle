import NodeGateway from '../../gateway/NodeGateway';
import MockMongoDatabaseConnection from '../../database/mongo/mock/MockMongoNodeDatabaseConnection';
import { INodeGateway, newFilePath } from "hypertext-interfaces"
import initTestingTree from '../NodeDatabaseConnection/Mock/initTestingTree';

jest.setTimeout(30000);
const dbConnection = new MockMongoDatabaseConnection()

describe('Unit Test: Move Node', () => {
  const nodeGateway: INodeGateway = new NodeGateway(dbConnection)

  beforeEach(async done => {
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
      }
    ])
    const initTreeResponse = await dbConnection.initTree(nodes)
    expect(initTreeResponse.success).toBeTruthy()
    done()
  })

  test("moves node", async done => {
    const getResponse = await dbConnection.findNodes(newFilePath(['b']))
    expect(getResponse.success).toBeTruthy()
    expect(getResponse.payload.length).toBe(1)

    const moveResponse = await nodeGateway.moveNode(newFilePath(['a', 'aa', 'aaa']), newFilePath(['b', 'aaa']))
    expect(moveResponse.success).toBeTruthy()
    
    const getResponse2 = await dbConnection.findNodes(newFilePath(['b']))
    expect(getResponse2.success).toBeTruthy()
    expect(getResponse2.payload.length).toBe(2)

    const getResponse3 = await dbConnection.findNodes(newFilePath(['b', 'aaa']))
    expect(getResponse3.success).toBeTruthy()
    expect(getResponse3.payload.length).toBe(1)
    done()
  })

  test("moves node", async done => {
    const getResponse = await dbConnection.findNodes(newFilePath(['a', 'aa']))
    expect(getResponse.success).toBeTruthy()
    expect(getResponse.payload.length).toBe(2)

    const moveResponse = await nodeGateway.moveNode(newFilePath(['a', 'aa', 'aaa']), newFilePath(['a', 'aaa']))
    expect(moveResponse.success).toBeTruthy()

    const getResponse2 = await dbConnection.findNodes(newFilePath(['a', 'aa']))
    expect(getResponse2.success).toBeTruthy()
    expect(getResponse2.payload.length).toBe(1)

    const getResponse3 = await dbConnection.findNodes(newFilePath(['a', 'aaa']))
    expect(getResponse3.success).toBeTruthy()
    expect(getResponse3.payload.length).toBe(1)
    done()
  })

  test("move from invalid location", async done => {
    const moveResponse = await nodeGateway.moveNode(newFilePath(['b', 'a', 'c']), newFilePath(['a']))
    expect(moveResponse.success).toBeFalsy()
    done()
  })

  test("move to invalid location", async done => {
    const moveResponse = await nodeGateway.moveNode(newFilePath(['a']), newFilePath(['x']))
    expect(moveResponse.success).toBeFalsy()

    const moveResponse2 = await nodeGateway.moveNode(newFilePath(['a', 'aa']), newFilePath(['a']))
    expect(moveResponse2.success).toBeFalsy()
    done()
  })

  test("move to invalid location", async done => {
    const invalidPath: any = 'string'
    const moveResponse = await nodeGateway.moveNode(newFilePath(['a']), invalidPath)
    expect(moveResponse.success).toBeFalsy()

    const moveResponse2 = await nodeGateway.moveNode(invalidPath, newFilePath(['a']))
    expect(moveResponse2.success).toBeFalsy()

    done()
  })

  test("cannot move a node to be a child of itself", async done => {
    const moveResponse = await nodeGateway.moveNode(newFilePath(['a']), newFilePath(['a', 'aa', 'a']))
    expect(moveResponse.success).toBeFalsy()

    const moveResponse2 = await nodeGateway.moveNode(newFilePath(['a']), newFilePath(['a', 'aa', 'aaa', 'a']))
    expect(moveResponse2.success).toBeFalsy()

    const moveResponse3 = await nodeGateway.moveNode(newFilePath(['a']), newFilePath(['a', 'aa', 'aaa', 'aaaa', 'a']))
    expect(moveResponse3.success).toBeFalsy()

    const moveResponse4 = await nodeGateway.moveNode(newFilePath(['a', 'aa']), newFilePath(['a', 'aa', 'aaa', 'aa']))
    expect(moveResponse4.success).toBeFalsy()

    const moveResponse5 = await nodeGateway.moveNode(newFilePath(['a', 'aa']), newFilePath(['a', 'aa', 'aaa', 'aaaa', 'aa']))
    expect(moveResponse5.success).toBeFalsy()

    const moveResponse6 = await nodeGateway.moveNode(newFilePath(['a', 'aa', 'aaa']), newFilePath(['a', 'aa', 'aaa', 'aaaa', 'aaa']))
    expect(moveResponse6.success).toBeFalsy()
    done()
  })

  test("move node to root", async done => {
    const getResponse = await dbConnection.findNodes(newFilePath(['a']))
    expect(getResponse.success).toBeTruthy()
    expect(getResponse.payload.length).toBe(3)

    const getResponse2 = await dbConnection.findNodes(newFilePath(['aa']))
    expect(getResponse2.success).toBeFalsy()

    const moveResponse = await nodeGateway.moveNode(newFilePath(['a', 'aa']), newFilePath(['aa']))
    expect(moveResponse.success).toBeTruthy()

    const getResponse3 = await dbConnection.findNodes(newFilePath(['a']))
    expect(getResponse3.success).toBeTruthy()
    expect(getResponse3.payload.length).toBe(1)

    const getResponse4 = await dbConnection.findNodes(newFilePath(['aa']))
    expect(getResponse4.success).toBeTruthy()
    expect(getResponse4.payload.length).toBe(2)
    done()
  })
})