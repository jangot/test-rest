"use strict";

const _ = require('lodash');

const RESOURCE_FOLDER = '../resource';

const errorPromise = {
    idIsNotExist: Promise.reject({code: 400, message: 'resource id is not exist'}),
    methodNotSupported: Promise.reject({code: 405, message: 'method is not supported'})
};

module.exports = (requestParams) => {
    let urlArray = requestParams.path.split('/');

    let resourceName = urlArray[1];
    let resourceId = urlArray[2];
    let method = urlArray[3] ? _.camelCase(urlArray[3]) : false;

    let resource;
    try {
        resource = require(`${RESOURCE_FOLDER}/${resourceName}`);
    } catch (e) {
        if (e.code == 'MODULE_NOT_FOUND') {
            return Promise.reject({code: 404, message: 'resource not found'});
        }
        return Promise.reject(e);
    }

    switch (requestParams.method) {
        case 'GET':
            if (resourceId) {
                return resource.getById(resourceId);
            } else {
                return resource.find(requestParams.query);
            }
            break;

        case 'PUT':
            return resource.create(requestParams.body);
            break;

        case 'POST':
            if (!resourceId) {
                return errorPromise.idIsNotExist;
            }

            if (method) {
                return resource[method](resourceId, requestParams.body);
            }
            return resource.update(resourceId, requestParams.body);
            break;

        case 'DELETE':
            if (!resourceId) {
                return errorPromise.idIsNotExist;
            }
            return resource.remove(resourceId);
            break;

        default:
            return errorPromise.methodNotSupported;
    }
};