# Test
## Requirements
+ `node 6.0.0`
+ `PostgreSQL 9.6.1` (I didn't test in prev versions)

## Migration
Before run migration need to install packages: `npm install`

Run migration: `node ./cli/migrate.js --name ${migrationName}`

There is one migration `initUserTable`.

There is no way to down migrations.

## Run
1. `npm install`
2. `node app.js`
3. Open: <http://localhost:8080/user>

## Rest api

### GET
`http://localhost:8080/:resource?[limit=:n]&[offset=:n]&[:someFieldName=:someFieldValue]` - get documents list
`http://localhost:8080/:resource/:id` - get a document by id

### PUT
`http://localhost:8080/:resource` - create a document

### POST
`http://localhost:8080/:resource/:id` - update a document
`http://localhost:8080/:resource/:id/:method` - update a document by special method 

### DELETE
`http://localhost:8080/:resource/:id` - remove a document by id

## Available resources

### user
Get, create and update users.
#### Fields:
* `user_id`
* `coins`
* `leave`

### level
Get unique levels of users

## Examples
PUT: http://localhost:8080/user/ - create user with default values.
POST: http://localhost:8080/user/:id/next-level - move user to next level.
GET: http://localhost:8080/user?level=2 - all users of the second level. The result has coins.
PUT: http://localhost:8080/level/ - get all unique levels (There is not limit and offset)




