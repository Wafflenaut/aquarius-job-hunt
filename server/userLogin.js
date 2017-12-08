require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
const {ObjectID} = require('mongodb');
var bcrypt = require('bcrypt');

// Input: username, password
// Logs user in. Returns 0 if wrong password/username or 1 if successful login
async function userLogin(usernameIn, passwordIn) {
  usernameIn = usernameIn.toLowerCase();
  var db = await MongoClient.connect(process.env.PROD_MONGODB);
  var userDoc = await db.collection('users').find({username: usernameIn}).project({hash: 1}).limit(1).next();
  if (!userDoc) {
    // username not found
    await db.close();
    return 0;
  }
  // compare hash to passwordIn
  if (await bcrypt.compare(passwordIn, userDoc.hash)) {
    // log user in
    await db.collection('users').updateOne(
      {_id: new ObjectID(userDoc._id)},
      {$set: {loggedIn: true}}
    );
    await db.close();
    return userDoc._id;
  } // else wrong password, return error 0
  await db.collection('users').updateOne(
    {_id: new ObjectID(userDoc._id)},
    {$set: {loggedIn: false}}
  );
  await db.close();
  return 0;
}

module.exports = { userLogin };
