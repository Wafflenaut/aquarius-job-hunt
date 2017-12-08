var dotenv = require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;

// Adds a new user to the database - Later it should also add the password hash and other user signup information.
// Input: a username
function addUser(usernameIn) {
  MongoClient.connect(process.env.PROD_MONGODB, function(err, db) {
    db.collection('users').insertOne({username: usernameIn});
    db.close();
  });
}

module.exports = { addUser };
