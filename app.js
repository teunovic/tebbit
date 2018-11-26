let express = require('express');
let mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');
const neo4j = require('neo4j-driver').v1;
const neo = require('./neo4j_setup');
const app = express();



mongoose.Promise = global.Promise;


    mongoose.connect('mongodb+srv://tbadmin:Tbtest123!@cluster0-xbiza.mongodb.net/Tebbit?retryWrites=true', { useNewUrlParser: true });
      console.log("MongoDB connected");




//TODO: Connect + Disconnect from Neo4J

neo.driver = neo4j.driver(
    'bolt://hobby-anjoodfghkjagbkebgnhcfbl.dbs.graphenedb.com:24786',
    neo4j.auth.basic('tbadmin', 'b.uB1ZLOg1TMfT.n2Gg7Fnf9UbWjGSr'));
    console.log("Neo4j connected");


// process.on('exit', function() {
//     neo.driver.close();
// });


app.use(bodyParser.json());

routes(app);

module.exports = app;