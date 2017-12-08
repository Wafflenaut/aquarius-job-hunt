var dotenv = require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
const {ObjectID} = require('mongodb');

// Input: username
// Edits the user's jobTitlePriority entry in their db document.
async function editJobTitlePriority(userIdIn, priorityIn) {
  var db = await MongoClient.connect(process.env.PROD_MONGODB);
  await db.collection('users').updateOne(
    {_id: new ObjectID(userIdIn)},
    {$set: { 'jobTitlePriority': priorityIn}}
  );
  await db.close();
}

module.exports = { editJobTitlePriority };
