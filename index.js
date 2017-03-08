"use strict";

var net = require('net');

function checkPort(port, cb) {
    var success_ix = 0;
    var error_ix = 0;

    var test_ipv4 = net.createServer()
        .once('error', onOnceError)
        .once('listening', function () { test_ipv4.once('close', onOnceClose).close(); })
        .listen(port, '0.0.0.0');

    var test_ipv6 = net.createServer()
        .once('error', onOnceError)
        .once('listening', function () { test_ipv6.once('close', onOnceClose).close(); })
        .listen(port, '::');

    function onOnceError(err) {
        if (err.code != 'EADDRINUSE') return cb(err);
        error_ix++;
        if (error_ix == 2) cb(null, true);
    }

    function onOnceClose() {
        success_ix++;
        if (success_ix == 2) cb(null, false);
    }

    // function onOnceListening(server) {
    //     server.once('close', onOnceClose).close();
    // }
}

function walkPort(port, callback) {
    port = parseInt(port, 10);
    if (!isFinite(port)) callback(new TypeError('port should be a finite number'))
        
    checkPort(port, function(err, isInUse) {
        if (err) callback(err);

        if (isInUse) {
            console.log(`Port "${port}" is busy...`);
            port = port + 1;
            walkPort(port, callback);
        } else {
            callback(null, port);
        }
    });
}

module.exports = walkPort;
