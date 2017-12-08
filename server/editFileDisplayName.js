var dotenv = require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
const {ObjectID} = require('mongodb');

// Input: file id, new display name
// Edits that file's display name for the user
async function editFileDisplayName(userIdIn, fileIdIn, displayNameIn) {
  var db = await MongoClient.connect(process.env.PROD_MONGODB);
  await db.collection('files').updateOne(
    {_id: new ObjectID(fileIdIn)},
    {$set: {displayName: displayNameIn}}
  );
  await db.close();
}

module.exports = { editFileDisplayName };
