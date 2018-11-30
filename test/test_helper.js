const mongoose = require('mongoose');
const neo4j = require('neo4j-driver').v1;
const neo = require('../neo4j_setup');

const session = neo.session();

beforeEach((done) => {
    mongoose.connection.collections.threads.drop(() => {
        mongoose.connection.collections.comments.drop(() => {
            mongoose.connection.collections.users.drop(() => {
                session.run(
                    'MATCH (n)\n' +
                    'DETACH DELETE n');
                done();

            })
        });
    });

});