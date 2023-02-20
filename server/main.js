const http = require('http');
const fs = require('fs').promises;

__dirname = "D:/CalvinAndHobbes"

const hostname = '127.0.0.1';
const port = 3000;

const site = (req, res) => {
  console.log("url: " + req.url);
  
  path = req.url.split('/');
  
  //check if the end of the path is a file being requested
  file = path[path.length-1];
  file_ext = file.indexOf('.') != -1 ? file.substring(file.indexOf('.')+1) : null;
  
  if (file_ext == 'png' || file_ext == 'css' || file_ext == 'gif' || file_ext == 'html') {

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
  else {
    res.statusCode = 404;
    res.end();
  }
   
}

const server = http.createServer(site);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

