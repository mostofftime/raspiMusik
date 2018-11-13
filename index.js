var express = require('express');
var app = express();
var path = require('path');
var Omx = require('node-omxplayer');
var player = Omx();

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
    //console.log(path.join(__dirname + '/index.html'));
    //res.send("Hello world!");
});

app.post('/play', function(req, res){
    if(!player.running){
        player.newSource("/media/Musik/10 - Twenty One Pilots - Guns For Hands.mp3");
    }else{
        player.play();
    }
});

app.listen(8080);
