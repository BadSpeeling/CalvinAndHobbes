const http = require('http');
const request = require('request');
const fs = require('fs').promises;

__dirname = "C:/Users/efrye/source/other/CalvinAndHobbes" //D:/CalvinAndHobbes"

const hostname = '127.0.0.1';
const port = 3000;

var info = {};
info.start_date = new Date('1985-11-18');
info.end_date = new Date('1995-12-31');

Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setUTCDate(date.getUTCDate() + days);
  return date;
}

const site = (req, res) => {
  console.log("url: " + req.url);
  
  path = req.url.split('?')[0].split('/');
  
  //don't give any access to anything in the server folder
  if (path.includes('server')) {
    res.statusCode = 403;
    res.end();
  }

  //check if the end of the path is a file being requested
  file = path[path.length-1];
  file_ext = file.indexOf('.') != -1 ? file.substring(file.indexOf('.')+1) : null;
  
  if (file_ext == 'png' || file_ext == 'css' || file_ext == 'gif' || file_ext == 'html' || file_ext == "js") {

    homepage = fs.readFile(__dirname + req.url)
    .then((contents) => {
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
        default:
          content_type = 'text/plain';
      }

      res.setHeader('Content-Type', content_type);
      res.end(contents);
    })
    .catch((err) => {
      res.statusCode = 404;
      res.end()
    });
  }
  else if (path[path.length-1] == 'comic') {

    var date = generate_random_date();
    var url = generate_comic_url(date);

    request(url, {}, (err,comic_res,body) => {
        
        var status_code = comic_res && comic_res.statusCode;

        if (status_code == 200) {
            res.statusCode = 200;
            console.log(date.toUTCString() + ' succeeded');
        }

        else {
            res.statusCode = 500;
            console.log(date.toUTCString() + ' failed');
        }

    });

    res.end(JSON.stringify({
      date,
      url: generate_comic_url(date),
      votes: {
        wins: 0,
        losses: 0
      }
    }));

  }
  else {
    res.statusCode = 404;
    res.end();
  }
   
}

const server = http.createServer(site);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

function generate_comic_url (date) {
    return `http://picayune.uclick.com/comics/ch/${date.getUTCFullYear().toString()}/ch${get_comic_id(date)}.gif`;
}

function generate_random_date () {
  
  var days_diff = (info.end_date - info.start_date)/ (1000 * 60 * 60 * 24) + 1;
  var cur_date = info.start_date;
  return cur_date.addDays(Math.random() * days_diff);
  
}

function get_comic_id (date) {

  var day_of_month = date.getUTCDate();
  if (day_of_month < 10) day_of_month = '0' + day_of_month.toString(); //must be 2 digits

  var month = date.getUTCMonth() + 1; //indexed 0-11, we want 01-12
  if (month < 10) month = '0' + month.toString();

  var year = date.getUTCFullYear().toString().substring(2);

  return year + month + day_of_month; //YYMMDD

}