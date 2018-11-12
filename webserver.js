const http = require('http');
const fs = require('fs');

//var Omx = require('node-omxplayer');
//var player = Omx('my-video.mp4');

const hostname = '192.168.0.69';
const port = 8080;

const server = http.createServer((req, res) => { //create server
  console.log(req.method);
  if (req.method === "post") {
    console.log("post");
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