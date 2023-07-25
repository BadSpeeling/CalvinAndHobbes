const db_client = require('./CH_Voter').db_client;

async function write_vote_result (vote_result) {

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
  
    db_client.close();
  
}

async function mongo_get_comic(comic_id) {

    await db_client.connect();
    const ch_voter_db = db_client.db("CH_Voter");
    const comics_coll = ch_voter_db.collection("comics");

    let comic = await comics_coll.findOne({
        "comic_id":comic_id
    });

    await db_client.close();

    return comic;

}

//comic_id of form chYYMMDD.gif
function parse_date_code(comic_id) {

    const re = /^ch(\d{6}).gif$/;
    comic_id_parse_results = comic_id.match(re);
  
    if (comic_id_parse_results) {
      return comic_id_parse_results[1];
    }
    else {
      throw new Error(comic_id + " is not of the form chYYMMDD.gif");
    }
  
}

module.exports = {write_vote_result,mongo_get_comic};