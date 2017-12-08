require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
const {ObjectID} = require('mongodb');
var getUser = require('./getUser').getUser;
var filterJobs = require('./filterJobs').filterJobs;

// Input: username
// Gets the jobs in the user's job queue, filters them and puts them back
async function reorderJobQueue(userIdIn) {
  var db = await MongoClient.connect(process.env.PROD_MONGODB);
  var userDoc = await getUser(userIdIn);
  // get the job docs
  var jobDocs = await db.collection('jobs').find({_id: {$in: userDoc.jobQueue}}).toArray();
  var filteredJobs = filterJobs(jobDocs, userDoc);
  // Update the job ids in the user's job queue array

  var jobIDs = filteredJobs.map(function(a) { return a._id; });
  await db.collection('users').updateOne(
    {_id: new ObjectID(userIdIn)},
    {$set: {'jobQueue': jobIDs}}
  );
  await db.close();
}

module.exports = { reorderJobQueue };
