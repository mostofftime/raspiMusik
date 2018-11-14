var express = require('express');
var app = express();
var path = require('path');
var Omx = require('node-omxplayer');
var player = Omx();
var playing = false;
var fs = require('fs');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// set the view engine to ejs
app.set('view engine', 'ejs');

var songs = [];
var mediaDir = "media/Musik/";
var currentSongIndex = 0;

fs.readdirSync(mediaDir)
    .filter(file => file.endsWith(".mp3"))
    .map(file => file.substring(0, file.length - 4))
    .forEach(file => {
        songs.push(file);
    })

window.setInterval(function () {
    console.log(playing);
}, 1000);

var currentSong = songs[currentSongIndex];

// viewed at http://localhost:8080
app.get('/', function (req, res) {
    res.render('index', {
        songs: songs
    });
});

app.post('/play', function (req, res) {
    if (!playing) {
        if (!player.running) {
            player.newSource(mediaDir + currentSong + ".mp3", "local", false, 5);
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

app.post('/song', function (req, res) {
    console.log("playing: " + req.body.title);
    player.newSource(mediaDir + req.body.title + ".mp3", "local", false, 5);
    playing = true;
});

app.listen(8080);
