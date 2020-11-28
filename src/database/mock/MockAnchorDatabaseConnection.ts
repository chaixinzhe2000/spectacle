import { ITestAnchorDatabaseConnection } from "../IAnchorDatabaseConnection";
import { IServiceResponse, successfulServiceResponse, failureServiceResponse, getServiceResponse, IAnchor } from "hypertext-interfaces"
import { getMongoAnchor, IMongoAnchor, tryGetAnchor } from "../helpers";

class MockMongoDatabaseConnection implements ITestAnchorDatabaseConnection {

  _anchors: {[anchorId: string]: IMongoAnchor}

  constructor() {
    this._anchors = {}
    this.clearAnchorCollection = this.clearAnchorCollection.bind(this);
    this.initAnchors = this.initAnchors.bind(this);
    this.insertAnchor = this.insertAnchor.bind(this);
    this.findAnchor = this.findAnchor.bind(this);
    this.findAnchors = this.findAnchors.bind(this);
    this.findAnchorsByNode = this.findAnchorsByNode.bind(this);
    this.deleteAnchor = this.deleteAnchor.bind(this);
    this.deleteAnchors = this.deleteAnchors.bind(this);
    this.deleteAnchorsByNode = this.deleteAnchorsByNode.bind(this);
  }

  async clearAnchorCollection(): Promise<IServiceResponse<{}>> {
    this._anchors = {}
    return successfulServiceResponse({})
  }

  async initAnchors(anchors: IAnchor[]): Promise<IServiceResponse<{}>> {
    anchors.forEach(anchor => {
      const mongoAnchorResp = getMongoAnchor(anchor)
      if (!mongoAnchorResp.success) {
        return failureServiceResponse(mongoAnchorResp.message)
      }
      this._anchors[anchor.anchorId] = mongoAnchorResp.payload
    })
    return successfulServiceResponse({})
  }

  async insertAnchor(anchor: IAnchor): Promise<IServiceResponse<IAnchor>> {

    const mongoAnchorResp = getMongoAnchor(anchor)
    if (!mongoAnchorResp.success) {
      return failureServiceResponse(mongoAnchorResp.message)
    } if (this._anchors[anchor.anchorId])
      return failureServiceResponse("Anchor already exists")
    this._anchors[anchor.anchorId] = mongoAnchorResp.payload
    return successfulServiceResponse(anchor)
  }

  async findAnchor(anchorId: string): Promise<IServiceResponse<IAnchor>> {

    const anchor = this._anchors[anchorId]

    if (anchor) {
      const tryCreateAnchorResp = tryGetAnchor(anchor)
      return getServiceResponse(tryCreateAnchorResp, "Failed to find anchor\n")
    }

    return failureServiceResponse("Failed to find anchors")

  }

  async findAnchors(anchorIds: string[]): Promise<IServiceResponse<{ [anchorId: string] : IAnchor }>> {
    if (anchorIds === null) 
      return failureServiceResponse("input is null")
    const anchors: { [anchorId: string] : IAnchor } = {}

    async function findAndAdd(anchorId: string, findAnchor: Function) {
      const findResponse = await findAnchor(anchorId)
      if (findResponse.success)
        anchors[findResponse.payload.anchorId] = findResponse.payload
    }

    await Promise.all(anchorIds.map(anchorId => {
      return findAndAdd(anchorId, this.findAnchor)
    }));

    if (Object.keys(anchors).length === 0) {
      return failureServiceResponse("Failed to find any anchors.")
    }

    return successfulServiceResponse(anchors)
  }

  async findAnchorsByNode(nodeId: string): Promise<IServiceResponse<{ [anchorId: string] : IAnchor }>> {
    if (nodeId === null) 
      return failureServiceResponse("input is null")
    const anchors: { [anchorId: string] : IAnchor } = {}
    
    Object.values(this._anchors).forEach(anc => {
      if (anc.nodeId === nodeId) {
        const anchorResp = tryGetAnchor(anc)
        if (anchorResp.success) {
          anchors[anchorResp.payload.anchorId] = anchorResp.payload
        }
      }
    });

    if (Object.keys(anchors).length > 0)
      return successfulServiceResponse(anchors)
    else
      return failureServiceResponse("Couldn't find any anchors with nodeId: " + nodeId)
  }

  async deleteAnchor(anchorId: string): Promise<IServiceResponse<{}>> {
    if (anchorId === null) 
      return failureServiceResponse("input is null")
    delete this._anchors[anchorId]
    return successfulServiceResponse({})
  }
  
  async deleteAnchors(anchorIds: string[]): Promise<IServiceResponse<{}>> {
    if (anchorIds === null) 
      return failureServiceResponse("input is null")
    let count = 0

    anchorIds.forEach(aid => {
      if (this._anchors[aid]) {
        delete this._anchors[aid]
        count++
      }
    })

    return successfulServiceResponse(count)
  }

  async deleteAnchorsByNode(nodeId: string): Promise<IServiceResponse<{}>> {
    if (nodeId === null) 
      return failureServiceResponse("input is null")
    let count = 0
    const anchorsToDelete: IAnchor[] = []

    Object.values(this._anchors).forEach(anc => {
      if (anc.nodeId === nodeId) {
        const anchorResp = tryGetAnchor(anc)
        if (anchorResp.success) {
          anchorsToDelete.push(anchorResp.payload)
        }
      }
    });

    anchorsToDelete.forEach(anch => {
      if (this._anchors[anch.anchorId]) {
        delete this._anchors[anch.anchorId]
        count++
      }
    })

   
    return successfulServiceResponse({})
    
  }
}

export default MockMongoDatabaseConnection