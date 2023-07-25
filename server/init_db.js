const db_client = require('./CH_Voter').db_client;

// async function foo (cur_date) {

//     let batch_size = 10;
//     let cur_batch_amt = 0;

//     let url = '';

//     await client.connect();

//     const ch_voter_db = client.db('CH_Voter');
//     const comic_coll = ch_voter_db.collection('comics');

//     console.log('Processing chunk ' + cur_date.toUTCString());

//     while (cur_batch_amt < batch_size && cur_date <= end_date) {

//         let insert_date = new Date(cur_date);
//         url = generate_comic_url(insert_date);    

//         var status_code = comic_res && comic_res.statusCode;

//         if (status_code == 200) {

//             const test_doc = {"comic_id": get_comic_id(insert_date), "wins": 0, "losses": 0};
//             const result = await comic_coll.insertOne(test_doc);
    
//         }
//         else {
//             //res.statusCode = 500;
//             console.log(insert_date.toUTCString() + ' failed ' + err);
//         }

//         cur_date.setUTCDate(cur_date.getUTCDate() + 1);
//         cur_batch_amt += 1

//     }

//     //check if we still have dates to run over
//     if (cur_date <= end_date) {
//         setTimeout(foo,2500,new Date(cur_date));
//     }

// }

function get_comic_id(date) {

    var day_of_month = date.getUTCDate();
    if (day_of_month < 10) day_of_month = '0' + day_of_month.toString(); //must be 2 digits

    var month = date.getUTCMonth() + 1; //indexed 0-11, we want 01-12
    if (month < 10) month = '0' + month.toString();

    var year = date.getUTCFullYear().toString().substring(2);

    return year + month + day_of_month; //YYMMDD

}

function generate_comic_url(date) {
    return `http://picayune.uclick.com/comics/ch/${date.getUTCFullYear().toString()}/ch${get_comic_id(date)}.gif`;
}

function create_date_list() {

    let comic_run_dates = [];

    let start_date = new Date('1985-11-18');
    let end_date = new Date('1995-12-31');

    let cur_date = new Date(start_date);

    while (cur_date <= end_date) {

        comic_run_dates = comic_run_dates.concat(new Date(cur_date));
        cur_date.setUTCDate(cur_date.getUTCDate() + 1);

    }

    return comic_run_dates;

}

function handle_comics(comic_dates) {

    var comic_docs_to_insert = [];

    comic_dates.forEach((element) => {
        comic_docs_to_insert = comic_docs_to_insert.concat({"comic_id": get_comic_id(element), "wins": 0, "losses": 0});
    });

    write_initial_comics(comic_docs_to_insert);

}

function checkImage (src, good, bad) {
    var img = new Image();
    img.onload = good;
    img.onerror = bad;
    img.src = src;
}

async function write_initial_comics(comic_docs_to_insert) {

    await db_client.connect();

    const ch_voter_db = db_client.db('CH_Voter');
    const comic_coll = ch_voter_db.collection('comics');
    await comic_coll.insertMany(comic_docs_to_insert);

    db_client.close();

}

handle_comics(create_date_list());
//write_initial_comics([{"TEST":"to be deleted"}]);