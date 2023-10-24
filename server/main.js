const http = require('http');
const fs = require('fs');
const process = require('process');

const {write_vote_result,mongo_get_comic} = require('./db_functionality');
const {log_error} = require('./logging.js');

root = process.cwd(); //"C:/Users/efrye/source/other/CalvinAndHobbes" "D:/CalvinAndHobbes"

const port = process.env.PORT || 3000;;

var info = {};
info.start_date = new Date('1985-11-18');
info.end_date = new Date('1995-12-31');

Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setUTCDate(date.getUTCDate() + days);
  return date;
}

const site = (req, res) => {

  let path = req.url.split('?')[0].split('/');
  
  //don't give any access to anything in the server folder
  if (path.includes('server')) {
    res.statusCode = 403;
    res.end();
  }

  //check if the end of the path is a file being requested
  let file = path[path.length-1];
  let file_ext = file.indexOf('.') != -1 ? file.substring(file.indexOf('.')+1) : null;
  
  //a file of some kind
  if (file_ext == 'png' || file_ext == 'css' || file_ext == 'gif' || file_ext == 'html' || file_ext == "js") {

    const data = fs.readFile(root + req.url, (err,data) => {

      if (err) {
        log_error({desc: req.url + " could not be found", error: err})
        res.statusCode = 404;
        res.end();
      }

      res.statusCode = 200;

      content_type = '';

      switch (file_ext){
        case 'png':
        case 'gif':
          content_type = 'images/' + file_ext;
          break;
        case 'css':
        case 'html':
          content_type = 'text/' + file_ext;
          break;
        case 'js':
          content_type = 'text/javascript';
          break;
        default:
          content_type = 'text/plain';
      }

      res.setHeader('Content-Type', content_type);
      res.end(data);

    });

  }
  //the comic endpoint, for requesting the stats of a C&H comic
  else if (path[path.length-1] == 'comic') {

    let url_param = req.url.split('?')[1]
     
    let comic_id = "";
    
    if (url_param) comic_id = parse_url_param(url_param).comic_id;

    //we have a comic_id, try to get the comic data for it
    if (comic_id) {
      
      mongo_get_comic(comic_id)
        .then((comic_data) => {

          if (comic_data) {

            let date = parse_date(comic_id);
            let url = generate_comic_url(comic_id);
      
            res.statusCode = 200;
            res.end(JSON.stringify({
              date,
              url,
              votes: {
                wins: comic_data.wins,
                losses: comic_data.losses
              }
            }));

          }
          else {
            res.statusCode = 500;
            res.end();
          }

        })
        .catch((err) => {

          log_error({desc:"Error loading comic data from DB",comic_id,error:err});

          res.statusCode = 500;
          res.end();

        });
      
    }
    else {
      res.statusCode = 400;
      res.end();
    }

  }
  //the vote endpoint, for submitting a vote for a C&H comic
  else if (path[path.length-1] == 'vote') {

    let body = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body).toString();
      
      let vote_doc = JSON.parse(body);
      
      if ('winner' in vote_doc && 'loser' in vote_doc) {
        write_vote_result(vote_doc).catch((err) => {log_error({desc:"Error writing vote data to DB",vote_doc,error:err});});
        res.statusCode = 200;
        res.end();
      }
      else {
        res.statusCode = 400;
        res.end();
      }

    });

  }
  else if (path[path.length-1] == 'ping') {
    atlas_ping();
  }
  else {
    res.statusCode = 404;
    res.end();
  }
   
}

run_server();

function run_server () {

    const server = http.createServer(site);

    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

}

function generate_comic_url (comic_id) {
    return `http://picayune.uclick.com/comics/ch/${"19"+comic_id.substring(0,2)}/ch${comic_id}.gif`;
}

function get_comic_id (date) {

  var day_of_month = date.getUTCDate();
  if (day_of_month < 10) day_of_month = '0' + day_of_month.toString(); //must be 2 digits

  var month = date.getUTCMonth() + 1; //indexed 0-11, we want 01-12
  if (month < 10) month = '0' + month.toString();

  var year = date.getUTCFullYear().toString().substring(2);

  return year + month + day_of_month; //YYMMDD

}

//comic_id of form YYMMDD
function parse_date (comic_id) {

  const re = /^(\d{2})(\d{2})(\d{2})$/;
  comic_id_parse_results = comic_id.match(re);

  if (comic_id_parse_results) {
    return new Date(comic_id_parse_results[1],comic_id_parse_results[2]-1,comic_id_parse_results[3]); //the month value is -1, because month is 0-11 not 1-12
  }
  else {
    throw new Error(comic_id + " is not of the form chYYMMDD.gif");
  }

}

function parse_url_param (enc) {

  let ret = {};

  let params = enc.split("&");

  for (i = 0; i < params.length; i++) {
    let param = params[i].split("=");
    if (param[0] && param[1]) ret[param[0]] = param[1];
  }

  return ret;

}

async function atlas_ping() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }