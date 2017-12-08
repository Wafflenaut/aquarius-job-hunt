require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
const {ObjectID} = require('mongodb');

// Input: userId and jobId
// Adds jobId to users's buriedJobs list
async function buryJob(userIdIn, jobIdIn) {
  var db = await MongoClient.connect(process.env.PROD_MONGODB);
  await db.collection('users').updateOne(
    {_id: new ObjectID(userIdIn)},
    {$addToSet: { 'buriedJobs': new ObjectID(jobIdIn)}}
  );
  await db.close();
}

module.exports = { buryJob };
