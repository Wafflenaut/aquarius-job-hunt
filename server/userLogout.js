require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
const {ObjectID} = require('mongodb');

// Input: user id
// Sets user to loggedOut: true in user db
async function userLogout(userIdIn) {
  var db = await MongoClient.connect(process.env.PROD_MONGODB);
  await db.collection('users').updateOne(
    {_id: new ObjectID(userIdIn)},
    {$set: {loggedIn: false}}
  );
  await db.close();
}

module.exports = { userLogout };
