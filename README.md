# Test
## Requirements
+ `node 6.0.0`
+ `PostgreSQL 9.6.1` (I didn't test in prev versions)

## Migration
Before run migration need install packages: `npm install`

Run migration: `node ./cli/migrate.js --name ${migrationName}`

There is one migration `initUserTable`.

There is no way to down migrations.

## Run
1. `npm install`
2. `node app.js`


