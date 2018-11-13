var express = require('express');
var app = express();
var path = require('path');
var Omx = require('node-omxplayer');
var player = Omx();
var playing = false;
var fs = require('fs');

var songs = [];

fs.readdirSync("./media").filter(file => file.endsWith(".mp3")).forEach(file => {
    songs.push(file);
})

// viewed at http://localhost:8080
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/play', function (req, res) {
    if (!playing) {
        if (!player.running) {
            player.newSource("/media/Musik/" + songs[3], "local", false, 10);
        } else {
            player.play();
        }
    }
    playing = true;
});

app.post('/pause', function (req, res) {
    if (playing) {
        player.pause();
    }
    playing = false;
});

app.post('/volUp', function (req, res) {
    if (player.running) {
        player.volUp();
    }
});

app.post('/volDown', function (req, res) {
    if (player.running) {
        player.volDown();
    }
});

app.listen(8080);
