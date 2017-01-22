"use strict";

const _ = require('lodash');
const db = require('../servises/db');
const CONSTANT = require('../servises/constants');

module.exports = {
    find: (params) => {
        let query = `
        SELECT level FROM ${CONSTANT.TABLE.USER.NAME}
        GROUP BY level
        `;
        return db
            .query(query)
            .then((result) => {
                let row = _.get(result, 'rows');

                if (!row) {
                    row = [];
                }

                return {
                    data: _.map(row, 'level')
                };
            })
    }
};