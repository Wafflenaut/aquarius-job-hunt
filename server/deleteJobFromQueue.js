var dotenv = require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
const {ObjectID} = require('mongodb');

// Input: userId of a user and the jobid of the user's job to delete from their jobQueue
async function deleteJobFromQueue(userIdIn, jobIdIn) {
  var db = await MongoClient.connect(process.env.PROD_MONGODB);
  var userDoc = await db.collection('users').find( { _id: new ObjectID(userIdIn)  } ).limit(1).next();
  await db.collection('users').updateOne(
    {_id: new ObjectID(userIdIn)},
    {$pull: { 'jobQueue': new ObjectID(jobIdIn)}}
  );
  //await db.collection('users').updateOne()
  await db.close();
}

module.exports = { deleteJobFromQueue };
