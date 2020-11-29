import { ITestIAnchorDatabaseConnection } from "../IAnchorDatabaseConnection";
import { IServiceResponse, successfulServiceResponse, failureServiceResponse, getServiceResponse, IImmutableGridAnchor } from "apposition-interfaces"
import { getMongoAnchor, IMongoAnchor, tryGetAnchor } from "../helpers";


// TODO
export default class MockMediaAnchorDatabaseConnection implements ITestMediaAnchorDatabaseConnection {

	_anchors: {[anchorId: string]: IMongoIImmutableTextAnchor}

	constructor() {
	  this._anchors = {}
	  this.clearAnchorCollection = this.clearAnchorCollection.bind(this);
	  this.initAnchors = this.initAnchors.bind(this);
	  this.insertAnchor = this.insertAnchor.bind(this);
	  this.findAnchor = this.findAnchor.bind(this);
	  this.deleteAnchor = this.deleteAnchor.bind(this);
	  this.deleteAnchors = this.deleteAnchors.bind(this);
	}
  
	async clearAnchorCollection(): Promise<IServiceResponse<{}>> {
	  this._anchors = {}
	  return successfulServiceResponse({})
	}
  
	async initAnchors(anchors: IImmutableTextAnchor[]): Promise<IServiceResponse<{}>> {
	  anchors.forEach(anchor => {
		const mongoAnchorResp = getMongoAnchor(anchor)
		if (!mongoAnchorResp.success) {
		  return failureServiceResponse(mongoAnchorResp.message)
		}
		this._anchors[anchor.anchorId] = mongoAnchorResp.payload
	  })
	  return successfulServiceResponse({})
	}
  
	async insertAnchor(anchor: IImmutableTextAnchor): Promise<IServiceResponse<IImmutableTextAnchor>> {
  
	  const mongoAnchorResp = getMongoAnchor(anchor)
	  if (!mongoAnchorResp.success) {
		return failureServiceResponse(mongoAnchorResp.message)
	  } if (this._anchors[anchor.anchorId])
		return failureServiceResponse("Anchor already exists")
	  this._anchors[anchor.anchorId] = mongoAnchorResp.payload
	  return successfulServiceResponse(anchor)
	}
  
	async findAnchor(anchorId: string): Promise<IServiceResponse<IImmutableTextAnchor>> {
  
	  const anchor = this._anchors[anchorId]
  
	  if (anchor) {
		const tryCreateAnchorResp = tryGetAnchor(anchor)
		return getServiceResponse(tryCreateAnchorResp, "Failed to find anchor\n")
	  }
  
	  return failureServiceResponse("Failed to find anchors")
  
	}
  
	async findAnchors(anchorIds: string[]): Promise<IServiceResponse<{[anchorId: string]: IImmutableTextAnchor}>> {
  
	  let anchors: {[anchorId: string]: IImmutableTextAnchor} = {}
  
	  anchorIds.forEach(aid => {
		if (this._anchors[aid]) {
		  const manchor = this._anchors[aid]
		  const tryCreateAnchorResp = tryGetAnchor(manchor)
		  if (tryCreateAnchorResp.success) {
			anchors[aid] = tryCreateAnchorResp.payload
		  }
		}
	  })
  
	  if (Object.keys(anchors).length > 0) {
		return successfulServiceResponse(anchors)
	  }
	  return failureServiceResponse("Failed to find anchors")
  
	}
  
	async deleteAnchor(anchorId: string): Promise<IServiceResponse<{}>> {
	  delete this._anchors[anchorId]
	  return successfulServiceResponse({})
	}
	
	async deleteAnchors(anchorIds: string[]): Promise<IServiceResponse<{}>> {
	  anchorIds.forEach(nid => delete this._anchors[nid])
	  return successfulServiceResponse({})
	}
}