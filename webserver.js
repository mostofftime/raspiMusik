const http = require('http');
const fs = require('fs');

var Omx = require('node-omxplayer');
var player = Omx();

const hostname = '192.168.0.69';
const port = 8080;

const server = http.createServer((req, res) => { //create server
  if (req.method === "POST") {

    console.log("POST");
    console.log(req.url);

    if (req.url === "/play") {
      console.log("start playing");
      console.log(player.running);
      player.play();
    }

    if(req.url === "/pause"){
      console.log("stop playing");
      player.pause();
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

    if(player.info() === ''){
      player.newSource('/media/10 - Twenty One Pilots - Guns For Hands.mp3');
    }

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