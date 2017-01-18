"use strict";
const db = require('../servises/db');
let commandLineArgs = require('command-line-args');

// TODO need to save migration after apply
// TODO need to make down migration

let params = commandLineArgs([
    { name: 'name', alias: 'n'}
]);

if (!params.name) {
    console.log('Migration name required');
    process.exit(1);
}

let migration;
try {
    migration = require(`../migrations/${params.name}`);
} catch (e) {
    if (e.code == 'MODULE_NOT_FOUND') {
        console.log(`Migration ${params.name} is not exist`);
    } else {
        console.log(e);
    }
    process.exit(1);
}

db
    .getConnection()
    .then(connect => {
        return migration.up(db);
    })
    .then(() => {
        return db.closeConnection();
    })
    .then(() => {
        console.log('Success');
        process.exit(0);
    })
    .catch(err => {
        console.log(err);
        process.exit(1);
    });

