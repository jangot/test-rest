"use strict";

const _ = require('lodash');
const insert = require('../servises/db/insert');
const select = require('../servises/db/select');
const db = require('../servises/db');

const AVAILABLE_FIELDS = ['user_id', 'coins', 'level'];
const TABLE_NAME = 'users';

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

        params = _.pick(params, AVAILABLE_FIELDS);

        let result = {
            meta: {
                limit,
                offset
            }
        };
        let countPromise = select(TABLE_NAME, ['count(*)'], params)
            .then(countResult => {
                result.meta.count = _.get(countResult, '[0].count', 0) * 1;
            });
        let dataPromise = select(TABLE_NAME, fields, params, limit, offset)
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

        return insert(TABLE_NAME, params, AVAILABLE_FIELDS)
            .then((row) => {
                if (!row) {
                    throw {code: 503, message: 'Unknown error'};
                }

                return {data: row};
            });
    },
    update: (id, params) => {

    }
};
