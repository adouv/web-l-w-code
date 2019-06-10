const path = window.require('path');
//nedb database
import Datastore from 'nedb';
//electron
const electron = window.require('electron');
const remote = electron.remote;
//kafka
// const kafka = window.require('kafka-node');
//mongodb
const mongodb = window.require('mongodb');
const MongoClient = mongodb.MongoClient;
// const Consumer = kafka.Consumer;
// const Client = new kafka.KafkaClient();
//kafka topic config
// let topic = [{
//     topic: 'lwk',
//     partition: 0
// }];
//kafka options config
// let options = {
//     // Auto commit config
//     autoCommit: false,
//     autoCommitMsgCount: 100,
//     autoCommitIntervalMs: 1000,
//     // Fetch message config
//     fetchMaxWaitMs: 100,
//     fetchMinBytes: 1,
//     fetchMaxBytes: 1024 * 10,
//     fromOffset: true,
//     fromBeginning: false
// };
//mongodb url mongodb://10.0.0.5:27017/   mongodb://localhost:27017/
let MongodbUrl = "mongodb://localhost:27017/";


let db = {};
/** 
 * nedb
 */
db.nedb = new Datastore({
    autoload: true,
    filename: path.join(remote.app.getPath('appData'), 'db/lwdevice.db')
});
/** 
 * kafka consumer
 */
// try {
//     db.consumer = new Consumer(Client, topic, options)
// } catch (error) {
//     console.log(error);
//     db.consumer = null;
// }
/** 
 * mongoDB
 */
db.mongodb = new Promise((resolve, reject) => {
    MongoClient.connect(MongodbUrl, {
        useNewUrlParser: true,
        socketTimeoutMS: 300000,
        keepAlive: true,
        reconnectTries: 300000,
        connectTimeoutMS: 300000
    }, (err, db) => {
        if (err) {
            reject(err);
            throw err;
        };
        resolve(db);
    });
});

export default db;