var express = require('express');
var app = express();
var Omx = require('node-omxplayer');
var id3 = require('id3js')

var player = Omx();
var playing = false;
var fs = require('fs');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

var songs = [];
var mediaDir = "media/Musik/";
var currentSongIndex = 0;
var songHistory = [];
var volume = 0;
var songDetails = [];
var playmodeEnum = { "shuffle": 1, "linear": 2 };

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
        none: "display : none;"
    });
});

app.post('/play', function (req, res) {
    if (!playing) {
        if (!player.running) {
            player.newSource(mediaDir + songs[currentSongIndex], "local", false);
            //setVolume();
            songHistory.push(currentSongIndex);
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
        player.volUp();
        volume++;
    }
});

app.post('/volDown', function (req, res) {
    if (player.running) {
        console.log("volume down");
        for (i = 0; i < 3; i++) {
            console.log(i);
            player.volDown();
        }
        volume--;
    }
});

app.post('/song', function (req, res) {
    console.log("playing: " + req.body.title);
    player.newSource(mediaDir + req.body.title, "local", false);
    //setVolume();
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
    //setNewSong();
    consolel.log("next");
});

app.post('/previous', function (req, res) {
    if (songHistory.pop.length > 0) {
        player.newSource(mediaDir + songs[songHistory.pop], "local", false);
        //setVolume();
        playing = true;
        console.log("previous");
    }
});

function setNewSong() {
    currentSongIndex = Math.round(Math.random() * songs.length);
    player.newSource(mediaDir + songs[currentSongIndex], "local", false);
    songHistory.push(currentSongIndex);
    playing = true;
    //setVolume();
}

function setVolume() {
    console.log("vol set");

    if (player.running) {
        console.log(volume);
        if (volume > 0) {
            for (i = 0; i < volume; i++) {
                player.volUp();
            }
        } else if (volume < 0) {
            for (i = 0; i < (volume * -1); i++) {
                player.volDown();
            }
        }
    }
}

app.listen(8080);
