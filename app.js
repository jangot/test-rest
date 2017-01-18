"use strict";

const http = require('http');
const url = require('url');
const config = require('config');
const router = require('./servises/router');

const PORT = config.get('server.port');

http
    .createServer((req, res) => {
        let urlObject = url.parse(req.url, true);

        if (req.method == 'OPTIONS') {
            res.writeHead(200, {
                'Content-Type': 'text/plain',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Request-Method': 'POST, GET, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Credentials': true
            });
            res.end('');
            return;
        }

        let requestParams = {
            method: req.method,
            query: urlObject.query,
            path: urlObject.pathname
        };

        router(requestParams)
            .then((result) => {
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end(JSON.stringify(result));
            })
            .catch((err) => {
                if (err.code) {
                    res.writeHead(err.code);
                    delete err.code;
                } else {
                    res.writeHead(503);
                }

                res.end(JSON.stringify(err));
            });
    })
    .listen(PORT);

console.log(`Server running on port ${PORT}.`);
