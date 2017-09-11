"use strict";

var path = require('path');
var express = require('express');

var walkPort = require('../src');

var app = express();

var directory = path.join(__dirname, '/');
var port = (process.argv[2] || 3360);

app.use(express.static(directory));

var server;
walkPort(port)
    .then((port) => {
        server = app.listen(port, () => {
            console.log(`Server started at http://localhost:${port}/`);
        });
    })
    .catch((rejection) => {
        console.error(rejection.error);
        process.exit(1);
    });
