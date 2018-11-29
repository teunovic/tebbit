const assert = require('assert');
const users = require('../models/users');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const threads = require('../models/threads');

chai.should();
chai.use(chaiHttp);


describe('Threads', () => {
    it('Saves a thread and returns correct body', (done) => {
        const user1 = new users.User({username: 'user1', password: '124'});
        user1.save()
            .then(() => {


        chai.request(server)
            .post('/threads')
            .send({
                'username': 'user1',
                'title': 'title1',
                'content': 'content1'
            })
            .end((err, res) => {
                res.should.have.status(200);
                const success = res.body;
                success.should.have.property('content').equals('content1');
                success.should.have.property('title').equals('title1');
                success.should.have.property('author');
                done();

            })
            });
    });


    it('Retrieves all threads', (done) => {

        threads.Thread.create({author: '5bfffc8d59be863ddc72848e', title: 'title1', content: 'content1'})
            .then(() => {
                threads.Thread.create({author: '5bfffc8d59be863ddc72848e', title: 'title2', content: 'content2'})
                    .then(() => {

                        chai.request(server)
                            .get('/threads')
                            .end((err, res) => {
                                res.should.have.status(200);
                                const success = res.body;
                                success.should.be.an('array');
                                success.should.have.length(2);
                                // success.should.have.property('author').equals('5bfffc8d59be863ddc72848e');
                                // success.should.have.property('title').equals('title1');
                                // success.should.have.property('content').equals('content1');
                                done();

                            });
                    });
            });
    });
    it('Done', (done) => {
        done();
    });
});
