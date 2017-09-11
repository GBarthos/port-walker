'use strict';
const net = require('net');
const clone = require('lodash.clone');

function getPort(params, options, context) {
    return new Promise(checkPort).catch((rejection) => {
        return new Promise((resolve, reject) => {
            const error = rejection.error;

            /* reject error other than port in use */
            if (error.code !== 'EADDRINUSE') {
                reject(rejection);
            } else {
                /* handle retry */
                handleRetry(resolve, reject)
                /* handle recursively walking ports up */
                    .then(handleRecursive(rejection, resolve, reject));
            }
        });
    });

    function checkPort(resolve, reject) {
        const server = net.createServer();

        server.unref();
        server.on('error', (error) => {
            server.close(() => {
                reject({
                    error: error
                });
            });
        });

        server.listen(params, () => {
            const address = server.address();
            server.close(() => {
                resolve(address.port);
            });
        });
    }

    function handleRetry(resolve, reject) {
        return new Promise((pass, fail) => {
            if (options.retry) {
                context.iteration++;
                if (options.retry >= context.iteration) {
                    if (options.onRetry) {
                        options.onRetry(clone(params), clone(context));
                    }
                    setTimeout(() => {
                        getPort(params, options, context).then(resolve).catch(reject);
                    }, options.timeout);
                } else {
                    context.iteration = 0;
                    pass();
                }
            } else {
                pass();
            }
        });
    }

    function handleRecursive(rejection, resolve, reject) {
        return (result) => {
            if (options.recursive) {
                if (options.onBusyPort) {
                    options.onBusyPort(clone(params), clone(context));
                }
                params.port++;
                setTimeout(() => {
                    getPort(params, options, context).then(resolve).catch(reject);
                }, options.timeout);
            } else {
                reject(rejection);
            }
        }
    }
};

module.exports = function(parameters, options) {
    function noop() {}
    const defaultParams = {
        port: 0,
    };
    const defaultOptions = {
        retry: 0,
        timeout: 0,
        recursive: true,
        onBusyPort: noop,
        onRetry: noop
    };

    // For backwards compatibility with number-only input
    if (typeof parameters === 'number') {
        parameters = {
            port: parameters
        };
    }

    if (!options) {
        options = {};
    }
    const opts = {
        retry: (typeof options.retry === 'number') ? options.retry : defaultOptions.retry,
        timeout: (typeof options.timeout === 'number') ? options.timeout : defaultOptions.timeout,
        recursive: (typeof options.recursive === 'boolean') ? options.recursive : defaultOptions.recursive,
        onBusyPort: (typeof options.onBusyPort === 'function') ? options.onBusyPort : defaultOptions.onBusyPort,
        onRetry: (typeof options.onRetry === 'function') ? options.onRetry : defaultOptions.onRetry
    };
    const ctx = {
        iteration: 0
    };

    return getPort(parameters, opts, ctx);
};
