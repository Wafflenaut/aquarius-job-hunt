var dotenv = require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
const {ObjectID} = require('mongodb');

// Input: user id
// Returns array that user's files uploaded. Or empty array if no files uploaded
async function getUserFiles(userIdIn) {
  var db = await MongoClient.connect(process.env.PROD_MONGODB);
  var userFiles = await db.collection('files').find(
    {userId: new ObjectID(userIdIn)}
  ).toArray();
  await db.close();
  return userFiles;
}

module.exports = { getUserFiles };
