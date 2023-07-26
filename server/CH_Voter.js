const {MongoClient, ServerApiVersion} = require('mongodb');

function new_client () {

    const password = 'ek0Lm3VFW0vcQlNV';
    const uri = `mongodb+srv://efrye:${encodeURIComponent(password)}@cluster0.hreropv.mongodb.net/?retryWrites=true&w=majority`;
    //const uri = "mongodb://127.0.0.1:27017";

    let db_client;

    try {
        db_client = new MongoClient (uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true
            }
        });
    }
    catch (err) {
        console.log(err);
    }

    return db_client;

}

module.exports = {new_client};

