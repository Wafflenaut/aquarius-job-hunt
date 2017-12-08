var dotenv = require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
const {ObjectID} = require('mongodb');

// Input: username
// Edits the user's keywordPriority entry in their db document.
async function editKeywordPriority(userIdIn, priorityIn) {
  var db = await MongoClient.connect(process.env.PROD_MONGODB);
  await db.collection('users').updateOne(
    {_id: new ObjectID(userIdIn)},
    {$set: { 'keywordPriority': priorityIn}}
  );
  await db.close();
}

module.exports = { editKeywordPriority };
