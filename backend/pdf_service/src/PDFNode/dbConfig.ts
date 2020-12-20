import { ITestPDFNodeDatabaseConnection } from './database/PDFNodeDatabaseConnection';
import MockDatabaseConnection from './database/mock/MockNodeDatabaseConnection';
import MongoDatabaseConnection from './database/mongo/MongoPDFNodeDatabaseConnection';

let DatabaseConnection: ITestPDFNodeDatabaseConnection = MongoDatabaseConnection
if (process.env.TEST === 'mock')
    DatabaseConnection = new MockDatabaseConnection()
export default DatabaseConnection;