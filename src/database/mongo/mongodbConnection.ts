import { MongoClient } from "mongodb";

// add mongo password and default db, replace with your own connection string
const uri = "";

const MongoDbConnection = function () {
  let client: MongoClient = null;
  let instance = 0;

  async function DbConnect(): Promise<MongoClient> {
    try {
      const _client = await new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }).connect();
      return _client;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async function Get(): Promise<MongoClient> {
    try {
      instance++; // this is just to count how many times our singleton is called.
      // console.log(`DbConnection called ${instance} times`);

      if (client != null) {
        // console.log(`db connection is already alive`);
        return client;
      } else {
        client = await DbConnect();
        return client;
      }
    } catch (e) {
      return e;
    }
  }

  return {
    Get: Get,
  };
};

export default MongoDbConnection();
