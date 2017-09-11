"use strict";

const path = require('path');
const express = require('express');

const walkPort = require('../src');

const app = express();

const directory = path.join(__dirname, '/');
const port = (process.argv[2] || 3360);

app.use(express.static(directory));

let server;
const options = {
    onBusyPort: (params) => { console.log(' ... port '+params.port+' is busy'); },
    onRetry: (params, context) => { console.log(' ... retry ('+context.iteration+')'); },
    retry: 2,
    timeout: 500
};

walkPort({ port: port, host: '127.0.0.1' }, options)
    .then((port) => {
        server = app.listen(port, () => {
            const address = server.address();
            console.log(`Server started at http://localhost:${address.port}/`);
        });
    })
    .catch((rejection) => {
        console.error(rejection.error);
        process.exit(1);
    });
