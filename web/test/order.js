const chai = require('chai');
const chaiHttp = require('chai-http');
const mysql = require("mysql");

chai.use(chaiHttp);

// Set process env
let mysqlConfig = {
    port            : 3306,
    user            : 'user',
    password        : 'password',
    database        : 'test'
};
process.env.DATABASE_HOST = 'db';
process.env.MYSQL_PORT = mysqlConfig.port;
process.env.MYSQL_USER = mysqlConfig.user;
process.env.MYSQL_PASSWORD = mysqlConfig.password;
process.env.MYSQL_DATABASE = mysqlConfig.database;

let app = require('../app');
let connection = mysql.createConnection(mysqlConfig);

describe('Orders', () => {
    // Clear order list before test
    before(() => {
        connection.connect();
        connection.query('TRUNCATE `orders`', (err, results) => {
            if (err) {
                return console.error("MySQL connection error: " + err.stack);
            }
            console.log("MySQL connected as id: " + connection.threadId);
        });
    });

    describe('/GET order list', () => {
        it('it should GET all the order list', (done) => {
            chai.request(app).get('/orders').end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
                done();
            });
        });
    });

    describe('/POST create order', () => {
        it('it should create an order', (done) => {
            let order = {
                origin: ['111', '222'],
                destination: ['222', '222']
            };
            chai.request(app).post('/orders').send(order).end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('id');
                res.body.should.have.property('distance');
                res.body.should.have.property('status');
                done();
            });
        });
    });

    describe('/GET order list after create an order', () => {
        it('it should GET all the order list', (done) => {
            chai.request(app).get('/orders').end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(1);
                done();
            });
        });
    });

    describe('/PATCH take order', () => {
        it('it should take an order', (done) => {
            let order = {
                id: 1
            };
            chai.request(app).patch('/orders/' + order.id).end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql('SUCCESS');
                done();
            });
        });
    });

    describe('/PATCH try to take a taken order', () => {
        it('it should take an order', (done) => {
            let order = {
                id: 1
            };
            chai.request(app).patch('/orders/' + order.id).end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql('TAKEN');
                done();
            });
        });
    });
});