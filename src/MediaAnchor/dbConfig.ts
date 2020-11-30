import { ITestMediaAnchorDatabaseConnection } from "./database/IMediaAnchorDatabaseConnection";
import MockMongoDatabaseConnection from "./database/mock/MockAnchorDatabaseConnection";
import MongoDatabaseConnection from "./database/mongo/MongoAnchorDatabaseConnection";

let DatabaseConnection: ITestMediaAnchorDatabaseConnection = MongoDatabaseConnection;
if (process.env.TEST === "mock")
  DatabaseConnection = new MockMongoDatabaseConnection();
export default DatabaseConnection;
