"use strict";

const http = require('http');
const querystring = require('querystring');
const url = require('url');
const config = require('config');
const router = require('./servises/router');

const PORT = config.get('server.port');
const _ = require('lodash');

http
    .createServer((req, res) => {
        let urlObject = url.parse(req.url, true);

        if (req.method == 'OPTIONS') {
            res.writeHead(200, {
                'Content-Type': 'application/json',
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

        getBody(req)
            .then((body) => {
                requestParams.body = body;

                return router(requestParams);
            })
            .then((result) => {
                res.writeHead(200, {'Content-Type': 'application/json'});
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

function getBody(request) {
    return new Promise((resolve, reject) => {
        var body = [];
        request
            .on('data', function(chunk) {
                body.push(chunk);
            })
            .on('error', (e) => {
                reject(e);
            })
            .on('end', function() {
                body = Buffer.concat(body).toString();
                try {
                    body = JSON.parse(body);
                } catch (e) {
                    body = querystring.parse(body);
                }

                resolve(body);
            });
    });
}
