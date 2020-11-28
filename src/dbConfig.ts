import { ITestAnchorDatabaseConnection } from './database/IAnchorDatabaseConnection';
import MockMongoDatabaseConnection from './database/mock/MockAnchorDatabaseConnection';
import MongoDatabaseConnection from './database/mongo/MongoNodeDatabaseConnection';

let DatabaseConnection: ITestAnchorDatabaseConnection = MongoDatabaseConnection
if (process.env.TEST === 'mock')
    DatabaseConnection = new MockMongoDatabaseConnection()
export default DatabaseConnection;