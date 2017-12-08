var dotenv = require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
const {ObjectID} = require('mongodb');

// Input: user id, job id of buried job
// Removes that job from buriedJob list
async function removeBuriedJob(userIdIn, jobIdIn) {
  var db = await MongoClient.connect(process.env.PROD_MONGODB);
  await db.collection('users').updateOne(
    {_id: new ObjectID(userIdIn)},
    {$pull: {buriedJobs: new ObjectID(jobIdIn)}}
  );
  await db.close();
}

module.exports = { removeBuriedJob };
