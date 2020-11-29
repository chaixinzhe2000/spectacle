import { Collection } from 'mongodb';
import { serviceName } from '../../../app';
import MongoDbConnection from '../../../mongodbConnection'

export async function getNodeCollection(connection: typeof MongoDbConnection): Promise<Collection> {
    let colName = `${serviceName}-nodes`
    if (process.env.DB === 'stage')
      colName = `stage-${serviceName}-nodes`
  
    try {
      const client = await connection.Get();
      const db = client.db()
      const collection = db.collection(colName);
      return collection;
    } catch (e) {
        console.log(e)
        return e;
    }
  }