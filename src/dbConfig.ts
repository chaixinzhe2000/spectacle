import { ITestAnchorDatabaseConnection } from './database/IAnchorDatabaseConnection';
import MockMongoDatabaseConnection from './database/mock/MockAnchorDatabaseConnection';
import MongoDatabaseConnection from './database/mongo/MongoAnchorDatabaseConnection';

let DatabaseConnection: ITestAnchorDatabaseConnection = MongoDatabaseConnection
if (process.env.TEST === 'mock')
    DatabaseConnection = new MockMongoDatabaseConnection()
export default DatabaseConnection;