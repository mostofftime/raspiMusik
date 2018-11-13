var express = require('express');
var app = express();

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    //res.sendFile(path.join(__dirname + '/index.html'));
    res.send("Hello world!");
});

app.listen(8080);
