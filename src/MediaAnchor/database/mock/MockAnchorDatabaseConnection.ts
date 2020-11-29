import { ITestIAnchorDatabaseConnection } from "../IAnchorDatabaseConnection";
import { IServiceResponse, successfulServiceResponse, failureServiceResponse, getServiceResponse, IImmutableGridAnchor } from "apposition-interfaces"
import { getMongoAnchor, IMongoAnchor, tryGetAnchor } from "../helpers";


// TODO
export default class MockAnchorDatabaseConnection implements ITestIAnchorDatabaseConnection {

  constructor() {
    this.clearAnchorCollection = this.clearAnchorCollection.bind(this);
  }

  async clearAnchorCollection(): Promise<IServiceResponse<{}>> {
    return successfulServiceResponse({})
  }
}