var dotenv = require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
const {ObjectID} = require('mongodb');

// Input: _id from the user's user document.
// Returns that user's list of applied jobs, along with resume, cover letter, and notes information.
// Or returns an empty array if the user has not marked any jobs applied
async function getAppliedJobs(userIdIn) {
  var db = await MongoClient.connect(process.env.PROD_MONGODB);
  var userDoc = await db.collection('users').find( { _id: new ObjectID(userIdIn)  } ).project({appliedJobs: 1}).limit(1).next();
  var appliedJobs = [];
  if (!userDoc.appliedJobs) {
    return appliedJobs;
  }
  for (var i = 0; i < userDoc.appliedJobs.length; i++) {
    var nextJob = await db.collection('jobs').find( {_id: new ObjectID(userDoc.appliedJobs[i])}).limit(1).next();
    var noteDoc = await db.collection('notes').find({jobId: new ObjectID(userDoc.appliedJobs[i])}).limit(1).next();
    var files = await db.collection('files').find({ associatedJobs: new ObjectID(userDoc.appliedJobs[i])}).toArray();
    if (noteDoc) {
      nextJob.noteText = noteDoc.text;
      nextJob.noteId = noteDoc._id;
    }
    if (files) {
      nextJob.files = files;
    }
    appliedJobs.push(nextJob);
  }
  await db.close();
  return appliedJobs;
}

module.exports = { getAppliedJobs };
