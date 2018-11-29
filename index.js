var express = require('express');
var app = express();
var Omx = require('node-omxplayer');
var id3 = require('id3js');
var path = require('path');

var player = Omx();
var playing = false;
var fs = require('fs');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

var songs = [];
var mediaDir = path.join(__dirname, 'media/Musik/');
var currentSongIndex = 0;
var songHistory = [];
var songDetails = [];
var playmodeEnum = { "shuffle": 1, "linear": 2 };
var mode = playmodeEnum.linear;
var volume = -1600;

//gets song file names from mediaDir
fs.readdirSync(mediaDir)
    .filter(file => file.endsWith(".mp3"))
    .forEach(file => {
        songs.push(file);
    });

//initialize songs and songdetails, sorting them with sort()
var asyncCounter = 0;
songDetails.length = songs.length;
songs.forEach(function (song, index) {
    id3({ file: mediaDir + song, type: id3.OPEN_LOCAL }, function (err, tags) {
        songDetails[index] = tags;
        asyncCounter++;
        if (asyncCounter === songs.length) {
            sort();
        }
    });
});

function sort() {
    var songMap = new Map();
    songs.forEach(function (song) {
        songMap.set(songDetails[songs.indexOf(song)], song);
    });

    songDetails.sort(function (a, b) {
        if (a.title > b.title) {
            return 1;
        }
        if (a.title < b.title) {
            return -1;
        }
        return 0;
    });

    songs = [];
    songDetails.forEach(
        function (detail, index) {
            songs.push(songMap.get(detail));
        }
    );
    console.log("Songs sorted, Server online")
}

setInterval(function () {
    if (playing && !player.running) {
        setNewSong();
    }
}, 1000);

//******************routing************************
app.get('/', function (req, res) {
    res.render('index', {
        songs: songs,
        songDetails: songDetails,
        playing: playing,
        inline: "display : inline;",
        none: "display : none;",
        mode : mode
    });
});

app.post('/play', function (req, res) {
    if (!playing) {
        if (!player.running) {
            player.newSource(mediaDir + songs[currentSongIndex], "local", false, volume);
            console.log("start playing");
        } else {
            console.log("continue playing")
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
        volume += 300;
        player.volUp();
    }
});

app.post('/volDown', function (req, res) {
    if (player.running) {
        console.log("volume down");
        volume -= 300;
        player.volDown();
    }
});

app.post('/song', function (req, res) {
    console.log("playing: " + songs[req.body.index]);
    songHistory.push(currentSongIndex);
    player.newSource(mediaDir + songs[req.body.index], "local", false, volume);
    currentSongIndex = req.body.index;
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
    console.log("next");
});

app.post('/previous', function (req, res) {
    if (songHistory.length > 0) {
        currentSongIndex = songHistory.pop();
        player.newSource(mediaDir + songs[currentSongIndex], "local", false, volume);
        playing = true;
        console.log("previou");
    }
});

app.post('/toggleShuffle', function (req, res) {
    mode = mode === playmodeEnum.linear ? playmodeEnum.shuffle : playmodeEnum.linear;
});

function setNewSong() {
    songHistory.push(currentSongIndex);
    if (mode === playmodeEnum.shuffle) {
        currentSongIndex = Math.round(Math.random() * songs.length);
    } else{
        currentSongIndex = ++currentSongIndex;
        if(currentSongIndex === songs.length){
            currentSongIndex = 0;
        }
    }
    player.newSource(mediaDir + songs[currentSongIndex], "local", false, volume);
    playing = true;
}

app.listen(8080);
