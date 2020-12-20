import { Collection } from 'mongodb';
import { serviceName } from '../../../app';
import MongoDbConnection from '../../../mongodbConnection'

export async function getCollection(connection: typeof MongoDbConnection): Promise<Collection> {
    let colName = `${serviceName}-anchors`
    if (process.env.DB === 'stage')
      colName =  `stage-${serviceName}-anchors`
  
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