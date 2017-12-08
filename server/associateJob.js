var dotenv = require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
const {ObjectID} = require('mongodb');

// Input: fileId (belonging ot a user), jobId (in a user's appliedJobs array)
// Lists that job id in the file's list of associatedJobs
async function associateJob(userIdIn, fileIdIn, jobIdIn) {
  var db = await MongoClient.connect(process.env.PROD_MONGODB);
  await db.collection('files').updateOne(
    {_id: new ObjectID(fileIdIn)},
    {$addToSet: {associatedJobs: new ObjectID(jobIdIn)}}
  );
  await db.close();
}

module.exports = { associateJob };
