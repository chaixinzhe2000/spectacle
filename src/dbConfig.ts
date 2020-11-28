import { ITestLinkDatabaseConnection } from "./database/ILinkDatabaseConnection";
import MockMongoLinkDatabaseConnection from "./database/mock/MockLinkDatabaseConnection";
import MongoDatabaseConnection from "./database/mongo/MongoLinkDatabaseConnection";

let DatabaseConnection: ITestLinkDatabaseConnection = MongoDatabaseConnection;
if (process.env.TEST === "mock")
  DatabaseConnection = new MockMongoLinkDatabaseConnection();
export default DatabaseConnection;
