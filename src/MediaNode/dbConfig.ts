import { ITestMediaNodeDatabaseConnection } from './database/NodeDatabaseConnection';
import MockDatabaseConnection from './database/mock/MockNodeDatabaseConnection';
import MongoDatabaseConnection from './database/mongo/MongoNodeDatabaseConnection';

let DatabaseConnection: ITestMediaNodeDatabaseConnection = MongoDatabaseConnection
if (process.env.TEST === 'mock')
    DatabaseConnection = new MockDatabaseConnection()
export default DatabaseConnection;