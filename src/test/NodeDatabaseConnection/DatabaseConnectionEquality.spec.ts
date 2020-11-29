import { createNode, newFilePath } from 'hypertext-interfaces';
import MockMongoDatabaseConnection from '../../database/mongo/mock/MockMongoNodeDatabaseConnection';
import MongoNodeDatabaseConnection from '../../database/mongo/MongoNodeDatabaseConnection';
import uniqid from 'uniqid'

describe('Check equality between database connections', () => {
  const mockConnection = new MockMongoDatabaseConnection()
  const mongoConnection = MongoNodeDatabaseConnection
  
  describe("insert node", () => {
      const uniqId = uniqid('test.')
      const validNode = createNode(uniqId, uniqId, newFilePath([uniqId]))
      const invalidNode: any = "invalid"

      afterAll(async done => {
        const mockResponse = await mockConnection.deleteNode(validNode.nodeId)
        const mognoResponse = await mongoConnection.deleteNode(validNode.nodeId)
        expect(mockResponse.success).toBeTruthy()
        expect(mockResponse.success).toBe(mognoResponse.success)
        done()
      })

      test("valid node", async done => {
        const mockResponse = await mockConnection.insertNode(validNode)
        const mognoResponse = await mongoConnection.insertNode(validNode)
        expect(mockResponse.success).toBeTruthy()
        expect(mockResponse.success).toBe(mognoResponse.success)
        done()
      })

      test("invalid node", async done => {
        const mockResponse = await mockConnection.insertNode(invalidNode)
        const mognoResponse = await mongoConnection.insertNode(invalidNode)
        expect(mockResponse.success).toBeFalsy()
        expect(mockResponse.success).toBe(mognoResponse.success)
        done()
      })
  })

  describe("update node", () => {
    const uniqId = uniqid('test.')
    const validNode = createNode(uniqId, uniqId, newFilePath([uniqId]))
    const invalidNode: any = "invalid"

    beforeAll(async done => {
        const mockResponse = await mockConnection.insertNode(validNode)
        const mognoResponse = await mongoConnection.insertNode(validNode)
        expect(mockResponse.success).toBeTruthy()
        expect(mockResponse.success).toBe(mognoResponse.success)
        done()
    })

    afterAll(async done => {
      const mockResponse = await mockConnection.deleteNode(validNode.nodeId)
      const mognoResponse = await mongoConnection.deleteNode(validNode.nodeId)
      expect(mockResponse.success).toBeTruthy()
      expect(mockResponse.success).toBe(mognoResponse.success)
      done()
    })

    test("valid node", async done => {
        let updatedNode = {...validNode}
        updatedNode.label = "test"
        const mockResponse = await mockConnection.updateNode(updatedNode)
        const mognoResponse = await mongoConnection.updateNode(updatedNode)
        expect(mockResponse.success).toBeTruthy()
        expect(mockResponse.success).toBe(mognoResponse.success)
        expect(mockResponse.payload.label).toBe('test')
        expect(mockResponse.payload.label).toBe(mognoResponse.payload.label)
        done()
    })

    test("invalid node", async done => {
        const mockResponse = await mockConnection.updateNode(invalidNode)
        const mognoResponse = await mongoConnection.updateNode(invalidNode)
        expect(mockResponse.success).toBeFalsy()
        expect(mockResponse.success).toBe(mognoResponse.success)
        done()
    })
  })

  describe("update nodes", () => {
    const uniqId = uniqid('test.')
    const validNode = createNode(uniqId, uniqId, newFilePath([uniqId]))
    const invalidNode: any = "invalid"

    beforeAll(async done => {
        const mockResponse = await mockConnection.insertNode(validNode)
        const mognoResponse = await mongoConnection.insertNode(validNode)
        expect(mockResponse.success).toBeTruthy()
        expect(mockResponse.success).toBe(mognoResponse.success)
        done()
    })

    afterAll(async done => {
      const mockResponse = await mockConnection.deleteNode(validNode.nodeId)
      const mognoResponse = await mongoConnection.deleteNode(validNode.nodeId)
      expect(mockResponse.success).toBeTruthy()
      expect(mockResponse.success).toBe(mognoResponse.success)
      done()
    })

    test("valid nodes", async done => {
        let updatedNode = {...validNode}
        updatedNode.label = "test"
        const mockResponse = await mockConnection.updateNodes([updatedNode])
        const mognoResponse = await mongoConnection.updateNodes([updatedNode])
        expect(mockResponse.success).toBeTruthy()
        expect(mockResponse.success).toBe(mognoResponse.success)
        done()
    })

    test("invalid node", async done => {
        const mockResponse = await mockConnection.updateNodes([invalidNode])
        const mognoResponse = await mongoConnection.updateNodes([invalidNode])
        expect(mockResponse.success).toBeFalsy()
        expect(mockResponse.success).toBe(mognoResponse.success)
        done()
    })
  })

  describe("find node", () => {
    const uniqId1 = uniqid('test.')
    const validNode1 = createNode(uniqId1, uniqId1, newFilePath([uniqId1]))

    beforeAll(async done => {
        const mockResponse = await mockConnection.insertNode(validNode1)
        const mognoResponse = await mongoConnection.insertNode(validNode1)
        expect(mockResponse.success).toBeTruthy()
        expect(mockResponse.success).toBe(mognoResponse.success)
        done()
    })

    afterAll(async done => {
        const mockResponse = await mockConnection.deleteNode(validNode1.nodeId)
        const mognoResponse = await mongoConnection.deleteNode(validNode1.nodeId)
        expect(mockResponse.success).toBeTruthy()
        expect(mockResponse.success).toBe(mognoResponse.success)
        done()
    })


    test("finds node", async done => {
        const mockResponse = await mockConnection.findNode(uniqId1)
        const mognoResponse = await mongoConnection.findNode(uniqId1)
        expect(mockResponse.success).toBeTruthy()
        expect(mockResponse.success).toBe(mognoResponse.success)
        expect(mockResponse.payload.nodeId).toBe(uniqId1)
        expect(mockResponse.payload.nodeId).toBe(mognoResponse.payload.nodeId)
        done()
    })

    test("finds node", async done => {
        const mockResponse = await mockConnection.findNode('random')
        const mognoResponse = await mongoConnection.findNode('random')
        expect(mockResponse.success).toBeFalsy()
        expect(mockResponse.success).toBe(mognoResponse.success)
        done()
    })
  })

  describe("find nodes", () => {
    const uniqId1 = uniqid('test.')
    const uniqId2 = uniqid('test.')
    const validNode1 = createNode(uniqId1, uniqId1, newFilePath([uniqId1]))
    const validNode2 = createNode(uniqId2, uniqId2, newFilePath([uniqId1, uniqId2]))

    beforeAll(async done => {
        const mockResponse = await mockConnection.insertNode(validNode1)
        const mognoResponse = await mongoConnection.insertNode(validNode1)
        expect(mockResponse.success).toBeTruthy()
        expect(mockResponse.success).toBe(mognoResponse.success)

        const mockResponse2 = await mockConnection.insertNode(validNode2)
        const mognoResponse2 = await mongoConnection.insertNode(validNode2)
        expect(mockResponse2.success).toBeTruthy()
        expect(mockResponse2.success).toBe(mognoResponse2.success)
        done()
    })

    afterAll(async done => {
        const mockResponse = await mockConnection.deleteNode(validNode1.nodeId)
        const mognoResponse = await mongoConnection.deleteNode(validNode1.nodeId)
        expect(mockResponse.success).toBeTruthy()
        expect(mockResponse.success).toBe(mognoResponse.success)

        const mockResponse2 = await mockConnection.deleteNode(validNode2.nodeId)
        const mognoResponse2 = await mongoConnection.deleteNode(validNode2.nodeId)
        expect(mockResponse2.success).toBeTruthy()
        expect(mockResponse2.success).toBe(mognoResponse2.success)
        done()
    })


    test("finds nodes", async done => {
        const mockResponse = await mockConnection.findNodes(newFilePath([uniqId1]))
        const mognoResponse = await mongoConnection.findNodes(newFilePath([uniqId1]))
        expect(mockResponse.success).toBeTruthy()
        expect(mockResponse.success).toBe(mognoResponse.success)
        expect(mockResponse.payload.length).toBe(2)
        expect(mockResponse.payload.length).toBe(mognoResponse.payload.length)

        const mockResponse2 = await mockConnection.findNodes(newFilePath([uniqId1, uniqId2]))
        const mognoResponse2 = await mongoConnection.findNodes(newFilePath([uniqId1, uniqId2]))
        expect(mockResponse2.success).toBeTruthy()
        expect(mockResponse2.success).toBe(mognoResponse2.success)
        expect(mockResponse2.payload.length).toBe(1)
        expect(mockResponse2.payload.length).toBe(mognoResponse2.payload.length)
        done()
    })

    test("fails to find nodes with invalid path", async done => {
        const mockResponse = await mockConnection.findNodes(newFilePath(['random']))
        const mognoResponse = await mongoConnection.findNodes(newFilePath(['random']))
        expect(mockResponse.success).toBeFalsy()
        expect(mockResponse.success).toBe(mognoResponse.success)
        done()
    })
  })

  describe("delete node", () => {
    const uniqId = uniqid('test.')
    const validNode = createNode(uniqId, uniqId, newFilePath([uniqId]))

    beforeAll(async done => {
        const mockResponse = await mockConnection.insertNode(validNode)
        const mognoResponse = await mongoConnection.insertNode(validNode)
        expect(mockResponse.success).toBeTruthy()
        expect(mockResponse.success).toBe(mognoResponse.success)
        done()
    })

    test("deletes existent node", async done => {
        const mockResponse = await mockConnection.deleteNode(uniqId)
        const mognoResponse = await mongoConnection.deleteNode(uniqId)
        expect(mockResponse.success).toBeTruthy()
        expect(mockResponse.success).toBe(mognoResponse.success)
        done()
    })

    test("deletes non-existent node", async done => {
        const mockResponse = await mockConnection.deleteNode('random')
        const mognoResponse = await mongoConnection.deleteNode('random')
        expect(mockResponse.success).toBeTruthy()
        expect(mockResponse.success).toBe(mognoResponse.success)
        done()
    })
  })

  describe("get root", () => {
    const uniqId1 = uniqid('test.')
    const uniqId2 = uniqid('test.')
    const validNode1 = createNode(uniqId1, uniqId1, newFilePath([uniqId1]))
    const validNode2 = createNode(uniqId2, uniqId2, newFilePath([uniqId1, uniqId2]))

    beforeAll(async done => {
        const mockResponse = await mockConnection.insertNode(validNode1)
        const mognoResponse = await mongoConnection.insertNode(validNode1)
        expect(mockResponse.success).toBeTruthy()
        expect(mockResponse.success).toBe(mognoResponse.success)

        const mockResponse2 = await mockConnection.insertNode(validNode2)
        const mognoResponse2 = await mongoConnection.insertNode(validNode2)
        expect(mockResponse2.success).toBeTruthy()
        expect(mockResponse2.success).toBe(mognoResponse2.success)
        done()
    })

    afterAll(async done => {
        const mockResponse = await mockConnection.deleteNode(validNode1.nodeId)
        const mognoResponse = await mongoConnection.deleteNode(validNode1.nodeId)
        expect(mockResponse.success).toBeTruthy()
        expect(mockResponse.success).toBe(mognoResponse.success)

        const mockResponse2 = await mockConnection.deleteNode(validNode2.nodeId)
        const mognoResponse2 = await mongoConnection.deleteNode(validNode2.nodeId)
        expect(mockResponse2.success).toBeTruthy()
        expect(mockResponse2.success).toBe(mognoResponse2.success)
        done()
    })


    test("gets root", async done => {
        const mockResponse = await mockConnection.getRoot()
        const mognoResponse = await mongoConnection.getRoot()
        expect(mockResponse.success).toBeTruthy()
        expect(mockResponse.success).toBe(mognoResponse.success)

        const mockNode1 = mockResponse.payload.find(({nodeId}) => nodeId === validNode1.nodeId)
        const mongoNode1 = mognoResponse.payload.find(({nodeId}) => nodeId === validNode1.nodeId)
        expect(mockNode1).not.toBeNull()
        expect(mongoNode1).not.toBeNull()

        const mockNode2 = mockResponse.payload.find(({nodeId}) => nodeId === validNode2.nodeId)
        const mongoNode2 = mognoResponse.payload.find(({nodeId}) => nodeId === validNode2.nodeId)
        expect(mockNode2).not.toBeNull()
        expect(mongoNode2).not.toBeNull()
        done()
    })
  })
})