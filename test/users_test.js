const assert = require('assert');
const users = require('../models/users');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
chai.should();
chai.use(chaiHttp);



describe('Users', () => {
    it('Saves a user and returns correct body', (done) => {

        chai.request(server)
            .post('/users')
            .send({
                'username': 'user1',
                'password': '123'
            })
            .end((err, res) => {
                res.should.have.status(200);
                const success = res.body;
                success.should.have.property('username').equals('user1');
                success.should.have.property('password').equals('123');
                done()

            });
    });

    it('Changes a user\'s password', (done) => {
        const user1 = new users.User({username: 'user1', password: '124'});
        user1.save()
            .then(() => {

                chai.request(server)
                    .put('/users')
                    .send({
                        'username': 'user1',
                        'password': '124',
                        'password_new': '1234'
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        const success = res.body;
                        success.should.have.property('username').equals('user1');
                        success.should.have.property('password').equals('1234');
                        done();

                    });

            });

    });

    it('Deletes a user // puts user on nonactive', (done) => {
        const user1 = new users.User({username: 'user1', password: '123'});
        user1.save()
            .then(() => {

                chai.request(server)
                    .delete('/users')
                    .send({
                        'username': 'user1',
                        'password': '123'
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        const success = res.body;
                        done();

                    });

            });

    });
    it('Done' ,(done) =>{
        done();
    });
});
