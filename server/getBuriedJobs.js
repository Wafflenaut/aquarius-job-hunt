var dotenv = require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
const {ObjectID} = require('mongodb');

// Input: _id from the user's user document.
// Returns full list of user's list of buried job documents
// Or returns an empty array if the user has no buried jobs
async function getBuriedJobs(userIdIn) {
  /*var db = await MongoClient.connect(process.env.PROD_MONGODB);
  var userDoc = await db.collection('users').find( { _id: new ObjectID(userIdIn)  } ).limit(1).next();
  var buriedJobs = [];
  if (!userDoc.buriedJobs) {
    return buriedJobs;
  }
  for (var i = 0; i < userDoc.buriedJobs.length; i++) {
    var nextJob = await db.collection('jobs').find( {_id: new ObjectID(userDoc.buriedJobs[i])}).limit(1).next();
    buriedJobs.push(nextJob);
  }
  await db.close();
  return buriedJobs;*/
  var db = await MongoClient.connect(process.env.PROD_MONGODB);
  var userDoc = await db.collection('users').find( { _id: new ObjectID(userIdIn)  } ).project({buriedJobs: 1}).limit(1).next();
  var buriedJobs = [];
  if (!userDoc.buriedJobs) {
    return buriedJobs;
  }
  for (var i = 0; i < userDoc.buriedJobs.length; i++) {
    var nextJob = await db.collection('jobs').find( {_id: new ObjectID(userDoc.buriedJobs[i])}).limit(1).next();
    var noteDoc = await db.collection('notes').find({jobId: new ObjectID(userDoc.buriedJobs[i])}).limit(1).next();
    var files = await db.collection('files').find({ associatedJobs: new ObjectID(userDoc.buriedJobs[i])}).toArray();
    if (noteDoc) {
      nextJob.noteText = noteDoc.text;
      nextJob.noteId = noteDoc._id;
    }
    if (files) {
      nextJob.files = files;
    }
    buriedJobs.push(nextJob);
  }
  await db.close();
  return buriedJobs;
}

module.exports = { getBuriedJobs };
