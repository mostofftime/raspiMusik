const http = require('http');
const fs = require('fs');

var Omx = require('node-omxplayer');
var player = Omx('/media/10 - Twenty One Pilots - Guns For Hands.mp3', 'local', true, 10);

const hostname = '192.168.0.69';
const port = 8080;

const server = http.createServer((req, res) => { //create server
  if (req.method === "POST") {

    console.log("POST");
    console.log(req.url);

    if (req.url === "/play") {
      console.log("play");
      player.play();
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });

    fs.readFile(__dirname + '/index.html', function (err, data) { //read file index.html in public folder
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/html' }); //display 404 on error
        return res.end("404 Not Found");
      }
      res.writeHead(200, { 'Content-Type': 'text/html' }); //write HTML
      res.write(data); //write data from index.html
      return res.end();
    })

  } else {
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
}
);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});