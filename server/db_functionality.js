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

module.exports = {write_vote_result,mongo_get_comic};