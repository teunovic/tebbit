const users = require('../models/users');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const threads = require('../models/threads');

chai.should();
chai.use(chaiHttp);


describe('Comments', () => {

    it('Posts comment on a thread', (done) => {
        const user1 = new users.User({username: 'user1', password: '124'});
        user1.save()
            .then((user) => {
                threads.Thread.create({author: '5bfffc8d59be863ddc72848e', title: 'title2', content: 'content2'})
                    .then((thread) => {

                        chai.request(server)
                            .post('threads/' + thread._id + '/comments')
                            .send({
                                'username': 'user1',
                                'content': 'test content comment on thread with title 2'
                            })
                            .end((err, res) => {
                                res.should.have.status(200);
                                done();

                            });
                    });
            });
    });

    it('Deletes comment', (done) => {
        const user1 = new users.User({username: 'user1', password: '124'});
        user1.save()
            .then((user) => {
                threads.Thread.create({author: '5bfffc8d59be863ddc72848e', title: 'title2', content: 'content2'})
                    .then((thread) => {

                        threads.Comment.create({thread: thread._id, author: user._id, content: 'content2'})
                            .then((comment) => {

                                chai.request(server)
                                    .delete('threads/' + thread._id + '/comments/' + comment._id)
                                    .send({'username': 'user1'})
                                    .end((err, res) => {
                                        res.should.have.status(200);
                                        done();
                                    })
                            });
                    });
            });
    });


    it('Votes for comment', (done) => {
        const user1 = new users.User({username: 'user1', password: '124'});
        user1.save()
            .then((user) => {
                threads.Thread.create({author: '5bfffc8d59be863ddc72848e', title: 'title2', content: 'content2'})
                    .then((thread) => {

                        threads.Comment.create({thread: thread._id, author: user._id, content: 'content2'})
                            .then((comment) => {

                                chai.request(server)
                                    .post('threads/' + thread._id + '/comments/' + comment._id + '/vote')
                                    .send({'username': 'user1'})
                                    .end((err, res) => {
                                        res.should.have.status(200);
                                        done();
                                    })
                            });
                    });
            });
    });

});