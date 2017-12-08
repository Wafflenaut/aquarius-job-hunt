require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
const {ObjectID} = require('mongodb');

// Input: username of a user
// Returns the user document with searchPreferences, ignoredJobs, and buriedJobs arrays
// Used to filter and order a jobs list
async function getUser(userIdIn) {
  var db = await MongoClient.connect(process.env.PROD_MONGODB);
  var user = await db.collection('users').find( { _id: new ObjectID(userIdIn) } ).limit(1).next();
  await db.close();
  return user;
}

module.exports = { getUser };
