"use strict";

const _ = require('lodash');
const db = require('./index');

module.exports = function(table, fields, where, limit, offset) {
    let query = `SELECT ${fields.join(',')} from ${table}`;
    let values = [];

    if (where) {
        let whereList = '';
        _.forEach(where, (value, name) => {
            if (whereList == '') {
                whereList += ' WHERE';
            } else {
                whereList += ' AND';
            }

            if (_.isArray(value)) {
                let itemValues = [];
                _.forEach(value, (item) => {
                    values.push(item);
                    itemValues.push(`$${values.length}`);
                });

                whereList += ` ${name} IN (${itemValues.join(',')})`;
            } else {
                values.push(value);
                whereList += ` ${name} = $${values.length}`;
            }
        });
        query += whereList;
    }

    if (limit) {
        let lastValue = values.length;
        query += ` LIMIT $${lastValue + 1}`;
        values.push(limit);
    }
    if (offset) {
        let lastValue = values.length;
        query += ` OFFSET $${lastValue + 1}`;
        values.push(offset);
    }

    query += ';';

    console.log(query);
    console.log(values);
    return db
        .query(query, values)
        .then((result) => {
            return _.get(result, 'rows', null);
        });
};