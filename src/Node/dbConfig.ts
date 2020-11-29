import { ITestNodeDatabaseConnection } from './database/NodeDatabaseConnection';
import MockDatabaseConnection from './database/mock/MockNodeDatabaseConnection';
import MongoDatabaseConnection from './database/mongo/MongoNodeDatabaseConnection';

let DatabaseConnection: ITestNodeDatabaseConnection = MongoDatabaseConnection
if (process.env.TEST === 'mock')
    DatabaseConnection = new MockDatabaseConnection()
export default DatabaseConnection;