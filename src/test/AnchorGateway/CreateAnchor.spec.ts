import { IAnchor, IAnchorGateway } from 'hypertext-interfaces';
import DatabaseConnection from '../../dbConfig';
import AnchorGateway from '../../gateway/AnchorGateway';

describe('Gateway Test: Create Anchor', () => {
  const anchorGateway: IAnchorGateway = new AnchorGateway(DatabaseConnection)

  beforeAll(async done => {
    const response = await DatabaseConnection.clearAnchorCollection()
    expect(response.success).toBeTruthy()
    done()
  })

  afterAll(async done => {
    const response = await DatabaseConnection.clearAnchorCollection()
    expect(response.success).toBeTruthy()
    done()
  })
  
  test("doesn't create invalid anchor", async done => {
    const badanchor: any = { 'id': 'id' }
    const response = await anchorGateway.createAnchor(badanchor)
    expect(response.success).toBeFalsy()
    done()
  })

  test("creates valid anchor", async done => {
    const validanchor: IAnchor = {
      nodeId: 'node.id',
      anchorId: 'anchor.id',
      label: 'label'
    }

    const getResponse = await DatabaseConnection.findAnchor(validanchor.anchorId)
    expect(getResponse.success).toBeFalsy()
    
    const response = await anchorGateway.createAnchor(validanchor)
    expect(response.success).toBeTruthy()

    const getResponse2 = await DatabaseConnection.findAnchor(validanchor.anchorId)
    expect(getResponse2.success).toBeTruthy()
    expect(getResponse2.payload).toStrictEqual(validanchor)
    done()
  })

  
  test("creates valid anchor, fails to create valid anchor with same id", async done => {
    const validanchor: IAnchor ={
      nodeId: 'node.id',
      anchorId: 'anchor.id2',
      label: 'label'
    }

    const getResponse = await DatabaseConnection.findAnchor(validanchor.anchorId)
    expect(getResponse.success).toBeFalsy()

    const response = await anchorGateway.createAnchor(validanchor)
    expect(response.success).toBeTruthy()

    const getResponse2 = await DatabaseConnection.findAnchor(validanchor.anchorId)
    expect(getResponse2.success).toBeTruthy()
    expect(getResponse2.payload).toStrictEqual(validanchor)

    const validanchor2: IAnchor = {
      nodeId: 'id2',
      anchorId: 'anchor.id2',
      label: 'label'
    }

    const response2 = await anchorGateway.createAnchor(validanchor2)
    expect(response2.success).toBeFalsy()

    const getResponse3 = await DatabaseConnection.findAnchor(validanchor.anchorId)
    expect(getResponse3.success).toBeTruthy()
    expect(getResponse3.payload).toStrictEqual(validanchor)
    done()
  })

  test("fails to create when anchorId is null", async done => {
    const invalidanchor: any = {
      nodeId: 'id4',
      anchorId: null
    }
    const response = await anchorGateway.createAnchor(invalidanchor)
    expect(response.success).toBeFalsy()
    done()
  })

  test("succeeds to create anchor when anchorId is number", async done => {
    const invalidanchor: any = {
      nodeId: 'id4',
      anchorId: 5,
      label: 'label'
    }
    const response = await anchorGateway.createAnchor(invalidanchor)
    expect(response.success).toBeFalsy()
    done()
  })

  test("succeeds to create anchor when anchorId is empty", async done => {
    const invalidanchor: any = {
      nodeId: 'id4',
      anchorId: '',
      label: 'label'
    }
    const response = await anchorGateway.createAnchor(invalidanchor)
    expect(response.success).toBeFalsy()
    done()
  })
})