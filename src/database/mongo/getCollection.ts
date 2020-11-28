import { Collection } from 'mongodb';
import MongoDbConnection from './mongodbConnection'

export async function getCollection(connection: typeof MongoDbConnection): Promise<Collection> {
    let colName = 'anchors'
    if (process.env.DB === 'stage')
      colName = 'stage-anchors'
  
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