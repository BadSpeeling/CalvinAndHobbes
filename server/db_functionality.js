const new_client = require('./CH_Voter').new_client;

async function write_vote_result (vote_result) {

  let db_client = new_client();

  if (db_client) {
    try {

      await db_client.connect();
      const ch_voter_db = db_client.db("CH_Voter");
      const comics_coll = ch_voter_db.collection("comics");
    
      await comics_coll.updateOne(
        {"comic_id":vote_result.winner},
        {$inc:{"wins":1}}
      );
    
      await comics_coll.updateOne(
        {"comic_id":vote_result.loser},
        {$inc:{"losses":1}}
      );
    }
    finally {
      db_client.close();
    }
  }

}

async function mongo_get_comic(comic_id) {

    let comic;
    let db_client = new_client();

    if (db_client) {
      try {
        await db_client.connect();
        const ch_voter_db = db_client.db("CH_Voter");
        const comics_coll = ch_voter_db.collection("comics");

        comic = await comics_coll.findOne({
            "comic_id":comic_id
        });
      }
      finally {
        await db_client.close();
      }
    }

    return comic;

}

async function write_error (body) {

  let error_record = {...body,"error":body?.error?.message}
  console.log(error_record);

  let db_client = new_client();

  if (db_client) {
    try {
      await db_client.connect();
      const ch_voter_db = db_client.db("CH_Voter");
      const error_coll = ch_voter_db.collection("errors");

      await error_coll.insertOne(error_record);
    }
    catch (e) {
      console.log("Could not write error to database. " + body.desc??"NO VALUE");
    }
    finally {
      await db_client.close();
    }
  }

}

module.exports = {write_vote_result,mongo_get_comic,write_error};