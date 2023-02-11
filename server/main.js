const http = require('http');
const fs = require('fs').promises;

__dirname = "D:/CalvinAndHobbes/"

const hostname = '127.0.0.1';
const port = 3000;

const site = (req, res) => {
  homepage = fs.readFile(__dirname + "/index.html")
  .then((contents) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(contents);
  })
  .catch((err) => {

  }); 

}

const server = http.createServer(site);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

