// @ts-ignore
import mongodb, { MongoClient } from 'mongo-mock'
// mongodb.max_delay = 0;//you can choose to NOT pretend to be async (default is 400ms)

// Connection URL
const url = 'mongodb://localhost:27017/myproject';

const MongoDbConnection = function () {

    let client: MongoClient = null;
    let instance = 0;

    async function DbConnect(): Promise<MongoClient> {
        try {
            const _client = await MongoClient.connect(url);
            return _client
        } catch (e) {
            console.log(e)
            return e;
        }
    }

   async function Get(): Promise<MongoClient> {
        try {
            instance++;     // this is just to count how many times our singleton is called.
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
        Get: Get
    }
}


export default MongoDbConnection()
