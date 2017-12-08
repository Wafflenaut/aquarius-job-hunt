require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
const {ObjectID} = require('mongodb');


// Input: userId, preference object
// Fetches jobs that match the preference and puts their IDs into the user's job queue
// No return value
async function fetchJobMatches(userIdIn, preferenceIn) {
  var db = await MongoClient.connect(process.env.PROD_MONGODB);
  var preference = preferenceIn.preference;
  var jobMatches = [];
  switch (preferenceIn.type) {
    case 'location':
      var commaIndex = preference.indexOf(',');
      var citySegment = preference.slice(0, commaIndex);
      var stateSegment = preference.slice(commaIndex + 2);
      jobMatches = jobMatches.concat(await db.collection('jobs').find(
        {crawled: true,
         city: citySegment,
         state: stateSegment}
      ).toArray());
      break;
    case 'jobTitle':
      jobMatches = jobMatches.concat(await db.collection('jobs').find(
        {crawled: true,
         jobTitle: { $regex: preference, $options: 'i' }}
      ).toArray());
      break;
    case 'keyword':
      jobMatches = jobMatches.concat(await db.collection('jobs').find(
        {crawled: true,
         body: { $regex: preference, $options: 'i' }}
      ).toArray());
      break;
    default:
      break;
  }
  if (jobMatches.length > 0) {
    // Add those job IDs into the user's job queue
    var jobMatchIDs = jobMatches.map(function(a) {
      return new ObjectID(a._id);
    });
    await db.collection('users').updateOne(
      {_id: new ObjectID(userIdIn)},
      {$addToSet: {jobQueue: {$each: jobMatchIDs}}}
    );
  }

  await db.close();
}

module.exports = { fetchJobMatches };
