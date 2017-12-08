require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
const {ObjectID} = require('mongodb');

// Input: userId, preference
// Returns array job ids that match the location and at least one other job title
async function matchLocation(userIdIn, preferenceIn) {

  var db = await MongoClient.connect(process.env.PROD_MONGODB);
  //var userDoc = await db.collection('users').find({_id: new ObjectID(userIdIn)}).project({searchPreferences: 1}).limit(1).next();
  //var { searchPreferences } = userDoc;
  var searchPreferences = await db.collection('preferences').find({userId: new ObjectID(userIdIn)}).toArray();

  // At least one job title match
  var jobTitlePrefs = [];
  for (var i = 0; i < searchPreferences.length; i++) {
    if (searchPreferences[i].type == 'jobTitle') {
      jobTitlePrefs.push(searchPreferences[i].preference);
    }
  }
  //console.log(jobTitlePrefs);

  const {preference} = preferenceIn;
  var commaIndex = preference.indexOf(',');
  var citySegment = preference.slice(0, commaIndex);
  var stateSegment = preference.slice(commaIndex + 2);

  /*var jobTitlesRegex = '/';
  for (var i = 0; i < jobTitlePrefs.length; i++) {
    jobTitlesRegex = jobTitlesRegex + jobTitlePrefs[i];
    if (i != jobTitlePrefs.length - 1) {
      jobTitlesRegex = jobTitlesRegex + '|';
    }
  }
  jobTitlesRegex = jobTitlesRegex + '/i';
  console.log(jobTitlesRegex);*/

  var jobTitlesOR = [];
  for (var i = 0; i < jobTitlePrefs.length; i++) {
    var jobRegex = {$regex: jobTitlePrefs[i], $options: 'i'};
    jobTitlesOR.push({jobTitle: jobRegex});
  }
  //console.log(jobTitlesOR);

  if (jobTitlesOR.length > 0) {
    var matches = await db.collection('jobs').find(
      {crawled: true, city: citySegment, state: stateSegment, $or: jobTitlesOR } // jobTitle: jobTitlesRegex }  // $or: jobTitlesOR }
    ).project({_id: 1}).toArray();
    await db.close();
    return matches.map(function(a) {return a._id;});
  }
  else {
    await db.close();
    return [];
  }
  // Match all job title preferences against the new matches for matches to list them in their match lists as well

  //console.log(matches);
  //console.log(matches.length);


}

module.exports = { matchLocation };
