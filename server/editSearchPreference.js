require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
const {ObjectID} = require('mongodb');

// Input: preference id and preference object
// Edits user preference in database or adds it if it doesn't exist
async function editSearchPreference(userIdIn, preferenceId, preferenceIn) {
  var db = await MongoClient.connect(process.env.PROD_MONGODB);
  await db.collection('preferences').updateOne(
    {_id: new ObjectID(preferenceId), userId: new ObjectID(userIdIn)},
    {strength: preferenceIn.strength}
  );
  await db.close();
  return preferenceIn;
}

module.exports = { editSearchPreference };
