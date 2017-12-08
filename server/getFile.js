var dotenv = require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
const {ObjectID} = require('mongodb');

// Input: file id
// Returns the file with the given id (_id, location, displayName, associatedJobs[])
async function getFile(fileIdIn) {
  var db = await MongoClient.connect(process.env.PROD_MONGODB);
  var file = await db.collection('files')
    .find({ _id: new ObjectID(fileIdIn)})
    .limit(1).next();
  await db.close();
  return file;
}

module.exports = { getFile };
