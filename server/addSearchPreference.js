require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
const {ObjectID} = require('mongodb');

// Input: username and preference object
// Adds new user preference in database
async function addSearchPreference(userIdIn, preferenceIn) {
  if (!preferenceIn) {
    return null;
  }
  var db = await MongoClient.connect(process.env.PROD_MONGODB);
  
  if(preferenceIn.type == 'location') {
    await db.collection('preferences').updateOne(
      {userId: new ObjectID(userIdIn), type: preferenceIn.type, preference: preferenceIn.preference},
      {userId: new ObjectID(userIdIn), type: preferenceIn.type, preference: preferenceIn.preference, strength: preferenceIn.strength, geolocation: preferenceIn.geolocation},
      {upsert: true}
    );
  }
  else{
    await db.collection('preferences').updateOne(
      {userId: new ObjectID(userIdIn), type: preferenceIn.type, preference: preferenceIn.preference},
      {userId: new ObjectID(userIdIn), type: preferenceIn.type, preference: preferenceIn.preference, strength: preferenceIn.strength},
      {upsert: true}
    );
  }

  await db.close();
  return preferenceIn;
}

module.exports = { addSearchPreference };
