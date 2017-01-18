"use strict";

const _ = require('lodash');
const db = require('./index');

module.exports = function(table, data, fieldsForSelect) {
    if (!data) {
        return Promise.reject({message: 'Data is required.'});
    }
    if (!table) {
        return Promise.reject({message: 'Table is required.'});
    }

    let fields = [];
    let valuesIndex = [];
    let values = [];

    _.forEach(data, (value, name) => {
        if (value) {
            fields.push(name);
            values.push(value);

            valuesIndex.push(`$${values.length}`);
        }
    });

    let query = `INSERT INTO ${table}`;

    if (values.length) {
        query += `(${fields.join(',')}) VALUES (${valuesIndex.join(',')})`
    } else {
        query += ` DEFAULT VALUES`
    }

    if (fieldsForSelect) {
        query += ` RETURNING ${fieldsForSelect.join(',')}`;
    }

    query += ';';

    return db
        .query(query, values)
        .then((result) => {
            return _.get(result, 'rows[0]', null);
        });
};