require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
var bcrypt = require('bcrypt');

// Input: username, password
// Create new entry in user db with username and hashed password
// Returns null if username already exists. new user id on success
async function userSignup(usernameIn, passwordIn) {
  usernameIn = usernameIn.toLowerCase();
  var db = await MongoClient.connect(process.env.PROD_MONGODB);
  // Check unique username
  var checkUnique = await db.collection('users').find({username: usernameIn}).project({_id: 1}).limit(1).next();
  if (checkUnique) {
    await db.close();
    return null;
  }
  // Create the user doc with hash
  var genHash = await bcrypt.hash(passwordIn, 8);
  var newUser = await db.collection('users').insertOne(
    {username: usernameIn, hash: genHash}
  );
  await db.close();
  return newUser.insertedId;
}

module.exports = { userSignup };
