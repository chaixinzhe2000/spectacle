import { ITestIAnchorDatabaseConnection } from "../IAnchorDatabaseConnection";
import MongoDbConnection from "../../../mongodbConnection";
import {
  IServiceResponse,
  successfulServiceResponse,
  failureServiceResponse,
  getServiceResponse,
  IImmutableGridAnchor,
} from "hypertext-interfaces";
import {
  getMongoAnchor,
  IMongoAnchor,
  tryGetAnchor,
} from "../helpers";
import { getCollection } from "./getCollection";


// TODO
const MongoDatabaseConnection: ITestIAnchorDatabaseConnection = {
  async clearAnchorCollection(): Promise<IServiceResponse<{}>> {
    const collection = await getCollection(MongoDbConnection);
    const response = await collection.deleteMany({});
    if (response.result.ok) {
      return successfulServiceResponse({});
    }

    return failureServiceResponse("Failed to clear anchor collection.");
  },
};

export default MongoDatabaseConnection;
