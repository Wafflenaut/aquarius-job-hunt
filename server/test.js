require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
const {ObjectID} = require('mongodb');
var editSearchPreference = require('./editSearchPreference.js').editSearchPreference;
var deleteSearchPreference = require('./deleteSearchPreference.js').deleteSearchPreference;
var addSearchPreference = require('./addSearchPreference.js').addSearchPreference;
var nextTopJobs = require('./nextTopJobs.js').nextTopJobs;
var addUser = require('./addUser.js').addUser;
var dotenv = require('dotenv').config();
var getJobs = require('./getJobs').getJobs;
var getUser = require('./getUser').getUser;
var updateJobQueue = require('./updateJobQueue').updateJobQueue;
var reorderJobQueue = require('./reorderJobQueue').reorderJobQueue;
var getJobQueue = require('./getJobQueue').getJobQueue;
var deleteJobFromQueue = require('./deleteJobFromQueue').deleteJobFromQueue;
var getAppliedJobs = require('./getAppliedJobs').getAppliedJobs;
var markApplied = require('./markApplied').markApplied;
var getBuriedJobs = require('./getBuriedJobs').getBuriedJobs;
var buryJob = require('./buryJob').buryJob;
var ignoreJob = require('./ignoreJob').ignoreJob;
var editJobTitlePriority = require('./editJobTitlePriority').editJobTitlePriority;
var editLocationPriority = require('./editLocationPriority').editLocationPriority;
var editKeywordPriority = require('./editKeywordPriority').editKeywordPriority;
var editUserNote = require('./editUserNote').editUserNote;
var getUserPreferences = require('./getUserPreferences').getUserPreferences;
var getUserFiles = require('./getUserFiles').getUserFiles;
var addUserFile = require('./addUserFile').addUserFile;
var deleteFile = require('./deleteFile').deleteFile;
var associateJob = require('./associateJob').associateJob;
var unassociateJob = require('./unassociateJob').unassociateJob;
var editUserNote = require('./editUserNote').editUserNote;
var fetchJobMatches = require('./fetchJobMatches').fetchJobMatches;
var userSignup = require('./userSignup').userSignup;
var userLogin = require('./userLogin').userLogin;
var userLogout = require('./userLogout').userLogout;
var deleteNote = require('./deleteNote').deleteNote;
var matchLocation = require('./matchLocation').matchLocation;
var matchJobTitle = require('./matchJobTitle').matchJobTitle;
var matchKeyword = require('./matchKeyword').matchKeyword;


// console.log(preference.slice(0, commaIndex));
// console.log(preference.slice(commaIndex + 2));

var preference = {type: 'jobTitle', preference: 'software', strength: 2};

async function printStuff() {
  // console.log(await nextTopJobs(10, "testuser", null));
  // console.log(await getJobQueue('testuser', 0, 11));
  //await editSearchPreference('testuser', preference);
  //await updateJobQueue('testuser');
  // await reorderJobQueue('testuser');
  // await deleteJobFromQueue('59ee547b867a0e3b1d6eccd9', '59eebae97faf650010189333');
  //await markApplied(59ee547b867a0e3b1d6eccd9
  //console.log(await getAppliedJobs('59ee547b867a0e3b1d6eccd9'));
  //await buryJob('59ee547b867a0e3b1d6eccd9', '59fbe9f02e23f90010f2b9a8');
  //console.log(await getBuriedJobs('59ee547b867a0e3b1d6eccd9'));
  //await ignoreJob('59ee547b867a0e3b1d6eccd9', '59f946e678ecf10010d978ca');
  //await deleteSearchPreference('59ee547b867a0e3b1d6eccd9', preference);
  //await editJobTitlePriority('59ee547b867a0e3b1d6eccd9', 3);
  //console.log(await getUserPreferences('59ee547b867a0e3b1d6eccd9'));
  //console.log(await getUserFiles('59ee547b867a0e3b1d6eccd9'));
  //await addUserFile('59ee547b867a0e3b1d6eccd9', 'SW_Resume#1', 'http://google.com');
  // await deleteFile('5a078fc14c10093907eea34b');
  //await associateJob('5a07912bfbf7bc3a7e7172b7', '59ed696e11d1fc00104dfe9f');
  //var appliedJobs = await getAppliedJobs('59ee547b867a0e3b1d6eccd9');
  //console.log(appliedJobs[0].files);
  //console.log(await getAppliedJobs('59ee547b867a0e3b1d6eccd9'));
  //await editUserNote('59ee547b867a0e3b1d6eccd9', '59ed696e11d1fc00104dfe9f', null, 'This is a test note for the testusers experience applying for this job.');
  //await reorderJobQueue('59ee547b867a0e3b1d6eccd9');
  //await updateJobQueue('59ee547b867a0e3b1d6eccd9');
  //await addSearchPreference('59ee547b867a0e3b1d6eccd9', preference);
  //await fetchJobMatches('59ee547b867a0e3b1d6eccd9', preference);
  // var db = await MongoClient.connect(process.env.PROD_MONGODB);
  // var testResult = await db.collection('jobs').find({jobKey: "falsekey"}).toArray();
  // console.log(testResult.length);
  // await db.close();
  //console.log(await userLogin('testuser99', 'badpassword'));
  //await userLogout('5a0e838c2168691db3e680f7');
  //console.log(await userLogout('5a13528980d02d05e7bdcbe4', 'badpassword'));
  //await deleteNote('5a0799cface31742f160abac');
  //console.log(await matchLocation('59ee547b867a0e3b1d6eccd9', {type: 'location', preference: 'Portland, OR', strength: 1}));
  //await deleteSearchPreference('5a15ff4a5197cb65e4c177d0');
  //console.log(await matchJobTitle('59ee547b867a0e3b1d6eccd9', preference));
  //await addSearchPreference('59ee547b867a0e3b1d6eccd9', {type: 'keyword', preference: 'internship', strength: 1});
  //await deleteSearchPreference('5a161c5b421c480d4d1f4044')
  //console.log(await getUserPreferences('59ee547b867a0e3b1d6eccd9'));
  //await deleteSearchPreference('5a160130421c480d4d14957c');
  //console.log(await matchKeyword('59ee547b867a0e3b1d6eccd9', {type: 'keyword', preference: 'internship', strength: 1}));
  //console.time("jobqueue");
  //await editLocationPriority('59ee547b867a0e3b1d6eccd9', 3);
  await updateJobQueue('59ee547b867a0e3b1d6eccd9');
  //console.log(await getJobQueue('59ee547b867a0e3b1d6eccd9', 0, 5));
  //console.timeEnd("jobqueue");
  //console.log(await getUserPreferences('5a18bcd4c88af36826f9a8cf'));

}

printStuff();
