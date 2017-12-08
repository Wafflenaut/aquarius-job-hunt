var dotenv = require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
const {ObjectID} = require('mongodb');

// Input: userId, displayName, location
// Adds file information document to files collection
async function addUserFile(userIdIn, displayNameIn, locationIn) {
  var db = await MongoClient.connect(process.env.PROD_MONGODB);
  await db.collection('files').insertOne({
    userId: new ObjectID(userIdIn),
    displayName: displayNameIn,
    location: locationIn
  });
  await db.close();
}

module.exports = { addUserFile };
