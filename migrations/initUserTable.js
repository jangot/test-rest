"use strict";

// migration `initUserTable`

const CREATE_TABLE_SQL = `
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    coins money DEFAULT 10000,
    level integer DEFAULT 1
);
`;

module.exports = {
    up: (db) => {
        return db.query(CREATE_TABLE_SQL);
    }
};