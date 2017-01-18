"use strict";

const config = require('config');
const pg = require('pg');

let client = new pg.Client(config.get('db'));
let connectionPromise = new Promise((resolve, reject) => {
    client.connect(function(err) {
        if(err) {
            reject(err);
        } else {
            resolve(client)
        }
    });
});

module.exports = {
    query: (query, params) => {
        params = params || [];
        return connectionPromise
            .then((client) => {
                return new Promise((resolve, reject) => {
                    client.query(query, params, function (err, result) {
                        if(err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                });
            });
    },
    getConnection: () => {
        return connectionPromise;
    },
    closeConnection: () => {
        return connectionPromise
            .then((client) => {
                return new Promise((resolve, reject) => {
                    client.end(function (err) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                });
            });
    }
};