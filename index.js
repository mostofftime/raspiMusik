var express = require('express');
var app = express();
var path = require('path');
var Omx = require('node-omxplayer');
var id3 = require('id3js')


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
var songHistory = [];
var volume = 5;
var songDetails = [];


fs.readdirSync(mediaDir)
    .filter(file => file.endsWith(".mp3"))
    .map(file => file.substring(0, file.length - 4))
    .forEach(file => {
        songs.push(file);
    });

setInterval(function () {
    if (playing && !player.running) {
        setNewSong();
    }
}, 1000);

songs.forEach(song => {
    id3({ file: mediaDir + song + ".mp3", type: id3.OPEN_LOCAL }, function(err, tags) {
        songDetails.push(tags);
    });
});

// viewed at http://localhost:8080
app.get('/', function (req, res) {
    res.render('index', {
        songs: songs,
        songDetails: songDetails
    });
});

app.post('/play', function (req, res) {
    if (!playing) {
        if (!player.running) {
            player.newSource(mediaDir + songs[currentSongIndex] + ".mp3", "local", false, volume);
            songHistory.push(currentSongIndex);
        } else {
            console.log("start playing");
            player.play();
        }
    }
    playing = true;
});

app.post('/pause', function (req, res) {
    if (playing) {
        console.log("pausing...");
        player.pause();
    }
    playing = false;
});

app.post('/volUp', function (req, res) {
    if (player.running) {
        console.log("volume up");
        player.volUp();
    }
});

app.post('/volDown', function (req, res) {
    if (player.running) {
        console.log("volume down");
        player.volDown();
    }
});

app.post('/song', function (req, res) {
    console.log("playing: " + req.body.title);
    player.newSource(mediaDir + req.body.title + ".mp3", "local", false, volume);
    playing = true;
});

app.post('/fwd30', function (req, res) {
    if (player.running) {
        console.log("30 seconds forwards");
        player.fwd30();
    }
});

app.post('/back30', function (req, res) {
    if (player.running) {
        console.log("30 seconds backwards");
        player.back30();
    }

});

app.post('/next', function (req, res) {
    setNewSong();
});

app.post('/previous', function (req, res) {
    if (songHistory.pop.length > 0) {
        player.newSource(mediaDir + songs[songHistory.pop] + ".mp3", "local", false, volume);
        playing = true;
    }
});

function setNewSong() {
    currentSongIndex = Math.round(Math.random() * songs.length);
    player.newSource(mediaDir + songs[currentSongIndex] + ".mp3", "local", false, volume);
    songHistory.push(currentSongIndex);
    playing = true;
}

app.listen(8080);
