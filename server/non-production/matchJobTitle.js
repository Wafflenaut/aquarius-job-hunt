require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
const {ObjectID} = require('mongodb');

// Input: user id, preference object to match
// Returns array of job ids that match the job title and at least one location
async function matchJobTitle(userIdIn, preferenceIn) {

  var db = await MongoClient.connect(process.env.PROD_MONGODB);
  var searchPreferences = await db.collection('preferences').find({userId: new ObjectID(userIdIn)}).toArray();
  //console.log(searchPreferences);
  var locationPrefs = [];
  for (var i = 0; i < searchPreferences.length; i++) {
    if (searchPreferences[i].type == 'location') {
      //var commaIndex = searchPreferences[i].preference.indexOf(',');
      locationPrefs.push(searchPreferences[i].preference); //.slice(0, commaIndex));
    }
  }
  var {preference} = preferenceIn;

  var locationsOR = [];
  for (var i = 0; i < locationPrefs.length; i++) {
    var commaIndex = locationPrefs[i].indexOf(',');
    var citySegment = locationPrefs[i].slice(0, commaIndex);
    var stateSegment = locationPrefs[i].slice(commaIndex + 2);
    locationsOR.push({city: citySegment, state: stateSegment});
  }

  if (locationsOR.length > 0) {
    var matches = await db.collection('jobs').find(
      {crawled: true, jobTitle: { $regex: preference, $options: 'i' }, $or: locationsOR }
    ).project({_id: 1}).toArray();

    await db.close();
    return matches.map(function(a) {return a._id;});
  }
  else {
    await db.close();
    return [];
  }
}

module.exports = { matchJobTitle };
