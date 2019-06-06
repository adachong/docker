let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');

chai.use(chaiHttp);

describe('Orders', () => {

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

    describe('/PATCH take order', () => {
        it('it should take an order', (done) => {
            let order = {
                id: 0
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
                id: 0
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