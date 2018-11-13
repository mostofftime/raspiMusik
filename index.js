var express = require('express');
var app = express();
var path = require('path');
var Omx = require('node-omxplayer');
var player = Omx();
var playing = false;
var fs = require('fs');

// set the view engine to ejs
app.set('view engine', 'ejs');

var songs = [];

fs.readdirSync("./media").filter(file => file.endsWith(".mp3")).forEach(file => {
    songs.push(file);
})

// viewed at http://localhost:8080
app.get('/', function (req, res) {
    
    var songJSON = "[";
    songs.forEach(song => {
        songJSON += "{ title: '" + song + "},"
    });

    songJSON.substring(0, songJSON.length - 1);
    songJSON += "]";

    console.log(songJSON);

    res.render('index', {
       songs :  songJSON
    });
});

app.post('/play', function (req, res) {
    if (!playing) {
        if (!player.running) {
            player.newSource("/media/Musik/" + songs[3], "local", false, 5);
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
