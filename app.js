let createError = require('http-errors');
let express = require('express');
let mongoose = require('mongoose');
let router = express.Router();
const bodyParser = require('body-parser');
const routes = require('./routes/routes');
const neo4j = require('neo4j-driver').v1;
const neo = require('./neo4j_setup');
let indexRouter = require('./routes/routes');
const app = express();



mongoose.Promise = global.Promise;


    mongoose.connect('mongodb+srv://tbadmin:Tbtest123!@cluster0-xbiza.mongodb.net/test?retryWrites=true', { useNewUrlParser: true });
      console.log("connected");




//TODO: Connect + Disconnect from Neo4J

// neo.driver = neo4j.driver(
//     'bolt://hobby-imgbemcofhjngbkeihlmpfbl.dbs.graphenedb.com:24786',
//     neo4j.auth.basic('dev', 'b.KjsQYVOye50q.Wsu6mTnSutd91R39')
// );

process.on('exit', function() {
    neo.driver.close();
});


app.use(bodyParser.json());

routes(app);

module.exports = app;