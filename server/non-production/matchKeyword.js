require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
const {ObjectID} = require('mongodb');

// Input: user id, preference object to match
// Returns array of matching job ids, matching at least one location and at least one job title
async function matchKeyword(userIdIn, preferenceIn) {

  var db = await MongoClient.connect(process.env.PROD_MONGODB);
  var searchPreferences = await db.collection('preferences').find({userId: new ObjectID(userIdIn)}).toArray();
  const {preference} = preferenceIn;

  var locationPrefs = [];
  for (var i = 0; i < searchPreferences.length; i++) {
    if (searchPreferences[i].type == 'location') {
      locationPrefs.push(searchPreferences[i].preference);
    }
  }

  var jobTitlePrefs = [];
  for (var i = 0; i < searchPreferences.length; i++) {
    if (searchPreferences[i].type == 'jobTitle') {
      jobTitlePrefs.push(searchPreferences[i].preference);
    }
  }

  var jobTitlesOR = [];
  for (var i = 0; i < jobTitlePrefs.length; i++) {
    var jobRegex = {$regex: jobTitlePrefs[i], $options: 'i'};
    jobTitlesOR.push({jobTitle: jobRegex});
  }

  var locationsOR = [];
  for (var i = 0; i < locationPrefs.length; i++) {
    var commaIndex = locationPrefs[i].indexOf(',');
    var citySegment = locationPrefs[i].slice(0, commaIndex);
    var stateSegment = locationPrefs[i].slice(commaIndex + 2);
    locationsOR.push({city: citySegment, state: stateSegment});
  }

  if (jobTitlesOR.length < 1 || locationsOR.length < 1) {
    var matches = await db.collection('jobs').find(
      {crawled: true, body: {$regex: preference, $options: 'i'}, $or: locationsOR, $or: jobTitlesOR }
    ).project({_id: 1}).toArray();

    await db.close();
    return matches.map(function(a) {return a._id;});
  }
  else {
    await db.close();
    return [];
  }
}

module.exports = { matchKeyword };
