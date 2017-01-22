"use strict";

const _ = require('lodash');
const insert = require('../servises/db/insert');
const select = require('../servises/db/select');
const db = require('../servises/db');
const CONSTANT = require('../servises/constants');

module.exports = {
    getById: (id) => {
        return Promise.reject({
            code: 405,
            message: 'method is not supported'
        });
    },
    find: (params) => {
        let limit = params.limit || 20;
        let offset = params.offset || 0;
        let fields = params.fields || ['*'];

        params = _.pick(params, CONSTANT.TABLE.USER.FIELDS);

        let result = {
            meta: {
                limit: Number(limit),
                offset: Number(offset)
            }
        };
        let countPromise = select(CONSTANT.TABLE.USER.NAME, ['count(*)'], params)
            .then(countResult => {
                result.meta.count = _.get(countResult, '[0].count', 0) * 1;
            });
        let dataPromise = select(CONSTANT.TABLE.USER.NAME, fields, params, limit, offset)
            .then((dataResult) => {
                result.data = dataResult;
            });

        return Promise
            .all([countPromise, dataPromise])
            .then(() => {
                return result;
            })
            .catch(() => {
                throw {code: 503, message: 'Unknown error'};
            })
    },
    create: (params) => {
        params = _.pick(params, ['coins', 'level']);

        return insert(CONSTANT.TABLE.USER.NAME, params, CONSTANT.TABLE.USER.FIELDS)
            .then((row) => {
                if (!row) {
                    throw {code: 503, message: 'Unknown error'};
                }

                return {data: row};
            });
    },
    nextLevel: (id, params) => {
        let query = `
        UPDATE ${CONSTANT.TABLE.USER.NAME} 
        SET level = level + 1 
        WHERE user_id = $1 
        RETURNING ${CONSTANT.TABLE.USER.FIELDS.join(',')}
        ;
        `;

        return db
            .query(query, [id])
            .then((result) => {
                let row = _.get(result, 'rows[0]');

                if (!row) {
                    throw {code: 503, message: 'Unknown error'};
                }

                return {
                    data: row
                };
            })
    },
    update: (id, params) => {
        return Promise.reject({
            code: 405,
            message: 'method is not supported'
        });
    }
};
