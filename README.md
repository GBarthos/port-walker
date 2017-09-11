port-walker
============

Walks ports to find an available one to use.

> This package purpose IS NOT to be use in production.
> This package aims at being used in a DEVELOPMENT environment.

### Install
```
$ npm install port-walker --save
```

### Example
```
const walkPort = require('port-walker');

walkPort({ port: 3000, host: '127.0.0.1' })
    .then((port) => {
        server = app.listen(port, () => {
            console.log(`Server started at http://localhost:${port}/`);
        });
    })
    .catch((rejection) => {
        console.error(rejection.error);
        process.exit(1);
    });
```

### Api
```
/**
    'parameters' could be a number (port number), or an object with the properties
    described in node documentation at https://nodejs.org/docs/latest-v4.x/api/net.html#net_server_listen_options_callback
*/

/**
    'options' is an object with the following properties:
    {{
        onBusyPort: [function]  optional, by default 'noop', callback used before walking up to the next port
        onRetry:    [function]  optional, by default 'noop', callback used to retry when port is already in use
        retry:      [number]    optional, by default 0,      number of retry for a given port
        recursive:  [boolean]   optional, by default true,   if false prevents walking up ports
        timeout:    [number]    optional, by default 0,      time to wait before retries and walking up ports
    }}
*/

const walkPort = require('port-walker');
const promise = walkPort(parameters, options);

/**
    the return value of 'walk-port' is an ES6 Promise.
*/
promise
    .then((result) => { ... })
    .catch((rejection) => { ... });

/**
    When resolving, 'result' is the available port number.
    When rejecting, 'rejection' is an object containing the error.
*/
```

That's all folks!
