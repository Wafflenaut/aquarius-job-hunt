require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
const {ObjectID} = require('mongodb');

// Input: userId of logged in user and jobId
// Adds jobId to user's appliedJobs list
async function markApplied(userIdIn, jobIdIn) {
  var db = await MongoClient.connect(process.env.PROD_MONGODB);
  await db.collection('users').updateOne(
    {_id: new ObjectID(userIdIn)},
    {$addToSet: { 'appliedJobs': new ObjectID(jobIdIn)}}
  );
  await db.close();
}

module.exports = { markApplied };
