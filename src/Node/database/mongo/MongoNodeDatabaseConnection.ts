import { ITestNodeDatabaseConnection } from "../NodeDatabaseConnection";
import MongoDbConnection from "../../../mongodbConnection";
import {
  IServiceResponse,
  successfulServiceResponse,
  failureServiceResponse,
} from "hypertext-interfaces";
import { getMongoNode, IMongoNode, getNode } from "../helpers";
import { getNodeCollection } from "./getCollection";

const MongoDatabaseConnection: ITestNodeDatabaseConnection = {
  async clearNodeCollection(): Promise<IServiceResponse<{}>> {
    const collection = await getNodeCollection(MongoDbConnection);
    const response = await collection.deleteMany({});
    if (response.result.ok) {
      return successfulServiceResponse({});
    }
    return failureServiceResponse("Failed to clear node collection.");
  }
};

export default MongoDatabaseConnection;
