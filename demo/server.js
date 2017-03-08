"use strict";

var path = require('path');
var express = require('express');

var walkPort = require('../');

var app = express();

var directory = path.join(__dirname, '/');
var port = (process.argv[2] || 3360);

app.use(express.static(directory));

var server;
walkPort(port, function(err, port) {
    if (err) {
        throw err;
    }

    if (port) {
        server = app.listen(port, function() {
            console.log(`Server started at http://localhost:${port}/`);
        });
    }
});
