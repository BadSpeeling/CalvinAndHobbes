const {MongoClient, ServerApiVersion} = require('mongodb');

const uri = "mongodb://127.0.0.1:27017";
const db_client = new MongoClient (uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
});

module.exports = {db_client};

