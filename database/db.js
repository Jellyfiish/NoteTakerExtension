var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var options = {server: {socketOptions: {keepAlive: 300000, connectTimeoutMS: 30000 }},
                replset: {socketOptions: {keepAlive: 300000, connectTimeoutMS : 30000 }}};

var MONGODB_URI = process.env.DATABASEURL || 'mongodb://localhost:27017/NoteExtension';
mongoose.connect(MONGODB_URI, options);

mongoose.Promise = global.Promise;

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log('connected to database');
});

module.exports = db;

// 'mongodb://localhost:27017/NoteExtension'
// 'mongodb://heroku_sz03msp8:f8dr4mvag1ke4iuaabbc4hna17@ds133221.mlab.com:33221/heroku_sz03msp8'
