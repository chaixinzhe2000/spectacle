import { Collection } from "mongodb";
import MongoDbConnection from "./mongodbConnection";

export async function getLinkCollection(
  connection: typeof MongoDbConnection
): Promise<Collection> {
  let colName = "links";
  if (process.env.DB === "stage") colName = "stage-links";

  try {
    const client = await connection.Get();
    const db = client.db();
    const collection = db.collection(colName);
    return collection;
  } catch (e) {
    console.log(e);
    return e;
  }
}
