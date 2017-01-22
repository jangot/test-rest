"use strict";

const config = require('config');
const PORT = config.get('server.port');

let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
// let server = require('../server');
var expect = chai.expect;

describe('/PUT user', () => {
    it('result is json', () => {
        return chai
            .request(`http://localhost:${PORT}`)
            .put('/user')
            .send({})
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.include.keys('data');
            });
    });

    it('result has user_id', () => {
        return chai
            .request(`http://localhost:${PORT}`)
            .put('/user')
            .send({})
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res.body.data).to.include.keys('user_id');
            });
    });

    it('result has default level', () => {
        return chai
            .request(`http://localhost:${PORT}`)
            .put('/user')
            .send({})
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res.body.data.level).to.eql(1);
            });
    });

    it('result has default coins', () => {
        return chai
            .request(`http://localhost:${PORT}`)
            .put('/user')
            .send({})
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res.body.data.coins).to.eql('$10,000.00');
            });
    });

    it('result has sent level', () => {
        return chai
            .request(`http://localhost:${PORT}`)
            .put('/user')
            .send({
                level: 5
            })
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res.body.data.level).to.eql(5);
            });
    });

    it('result has sent coins', () => {
        return chai
            .request(`http://localhost:${PORT}`)
            .put('/user')
            .send({
                coins: 100
            })
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res.body.data.coins).to.eql('$100.00');
            });
    });
});