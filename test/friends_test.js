const assert = require('assert');
const users = require('../models/users');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
chai.should();
chai.use(chaiHttp);



describe('Friends', () => {
    it('Saves a friendship', (done) => {
            const user1 = new users.User({username: 'user1', password: '124'});
            const user2 = new users.User({username: 'user2', password: '124'});

            chai.request(server)
                .post('/friends')
                .send({
                    'username': 'user1',
                    'other_username': 'user2'
                })
                .end((err, res) => {
                    res.should.have.status(200);

                });
            done();
        }

    );
        it('Deletes a friendship', (done) => {
            const user1 = new users.User({username: 'user1', password: '124'});
            const user2 = new users.User({username: 'user2', password: '124'});
            chai.request(server)
                .post('/friends')
                .send({
                    'username': 'user1',
                    'other_username': 'user2'
                }).then(() =>{


            chai.request(server)
                .delete('/friends')
                .send({
                    'username': 'user1',
                    'other_username': 'user2'
                })
                .end((err, res) => {
                    res.should.have.status(200);

                });
            });
            done()
        })
    });

