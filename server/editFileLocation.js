var dotenv = require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
const {ObjectID} = require('mongodb');

// Input: file id, new location
// Edits that file's location for the user
async function editFileLocation(userIdIn, fileIdIn, locationIn) {
  var db = await MongoClient.connect(process.env.PROD_MONGODB);
  await db.collection('files').updateOne(
    {_id: new ObjectID(fileIdIn)},
    {$set: {location: locationIn}}
  );
  await db.close();
}

module.exports = { editFileLocation };
