import INodeDatabaseConnection, { ITestNodeDatabaseConnection } from "../NodeDatabaseConnection";
import { Collection } from 'mongodb';
import { IServiceResponse, successfulServiceResponse, failureServiceResponse, getServiceResponse } from "apposition-interfaces"
import { getMongoNode, IMongoNode, getNode } from "../helpers";
import { IMongoAnchor } from "../../../MediaAnchor/database/helpers";


// TODO
class MockDatabaseConnection implements ITestNodeDatabaseConnection {

  constructor() {
    this.clearNodeCollection = this.clearNodeCollection.bind(this);
  }

  async clearNodeCollection(): Promise<IServiceResponse<{}>> {
    return successfulServiceResponse({})
  }

}

export default MockDatabaseConnection