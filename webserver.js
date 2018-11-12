const http = require('http');
const fs = require('fs');

const hostname = '192.168.0.69';
const port = 8080;

const server = http.createServer((req, res) => { //create server
  fs.readFile(__dirname + '/index.html', function (err, data) { //read file index.html in public folder
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' }); //display 404 on error
      return res.end("404 Not Found");
    }
    res.writeHead(200, { 'Content-Type': 'text/html' }); //write HTML
    res.write(data); //write data from index.html
    return res.end();
  })
}
);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

app.post("/", function (req, res) {
  console.log("post bekommen");
});