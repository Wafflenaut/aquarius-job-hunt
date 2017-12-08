const express = require('express');
const cors = require('cors');
var indeedUncrawled = require('./server/getUncrawledJobs');
var indeedCrawled = require('./server/getCrawledJobs');
var indeedUpdate = require('./server/updateCrawledJobs');
var addCrawled = require('./server/addNewJobs');
var bodyParser = require('body-parser');
var nextTopJobs = require('./server/nextTopJobs').nextTopJobs;
var buryJob = require('./server/buryJob').buryJob;
var markApplied = require('./server/markApplied').markApplied;
var ignoreJob = require('./server/ignoreJob').ignoreJob;
var editSearchPreference = require('./server/editSearchPreference').editSearchPreference;
var deleteSearchPreference = require('./server/deleteSearchPreference.js').deleteSearchPreference;
var addSearchPreference = require('./server/addSearchPreference.js').addSearchPreference;
var getJobQueue = require('./server/getJobQueue').getJobQueue;
var reorderJobQueue = require('./server/reorderJobQueue').reorderJobQueue;
var setJobsLastModified = require('./server/setJobsLastModified').setJobsLastModified;
var editLocationPriority = require('./server/editLocationPriority').editLocationPriority;
var editJobTitlePriority = require('./server/editJobTitlePriority').editJobTitlePriority;
var editKeywordPriority = require('./server/editKeywordPriority').editKeywordPriority;
var getAppliedJobs = require('./server/getAppliedJobs').getAppliedJobs;
var getBuriedJobs = require('./server/getBuriedJobs').getBuriedJobs;
var deleteJobFromQueue = require('./server/deleteJobFromQueue').deleteJobFromQueue;
var editUserNote = require('./server/editUserNote').editUserNote;
var getUserPreferences = require('./server/getUserPreferences').getUserPreferences;
var getUserFiles = require('./server/getUserFiles').getUserFiles;
var getFile = require('./server/getFile').getFile;
var addUserFile = require('./server/addUserFile').addUserFile;
var editFileDisplayName = require('./server/editFileDisplayName').editFileDisplayName;
var editFileLocation = require('./server/editFileLocation').editFileLocation;
var deleteFile = require('./server/deleteFile').deleteFile;
var associateJob = require('./server/associateJob').associateJob;
var unassociateJob = require('./server/unassociateJob').unassociateJob;
//var fetchJobMatches = require('./server/fetchJobMatches').fetchJobMatches;
var userLogin = require('./server/userLogin').userLogin;
var userSignup = require('./server/userSignup').userSignup;
var userLogout = require('./server/userLogout').userLogout;
var deleteNote = require('./server/deleteNote').deleteNote;
var removeBuriedJob = require('./server/removeBuriedJob').removeBuriedJob;
var updateJobQueue = require('./server/updateJobQueue').updateJobQueue;
var getGeo = require('./server/getGeolocation').findGeolocationCityState;


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('port', (process.env.PORT || 3001));

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.use(cors());

app.get('/api/sample', (req, res) => {
  const param = req.query.q;

  res.json("sample response");
});

//Parameters: None
//Purpose: Sends the uncrawled indeed jobs for crawling
//Output: N/A
app.get('/indeed-uncrawled', (req, res) => {
  indeedUncrawled.getUncrawledJobs().then((uncrawledJobs) => {
    console.log('Sent uncrawled jobs');
    res.status(200).send(uncrawledJobs);
  }, (e) => {
    res.status(400).send(e);
  });
});

//Parameters: None
//Purpose: Sends the crawled indeed jobs for crawling
//Output: N/A
app.get('/indeed-crawled', (req, res) => {
  indeedCrawled.getCrawledJobs().then((crawledJobs) => {
    console.log('Sent crawled jobs');
    res.status(200).send(crawledJobs);
  }, (e) => {
    res.status(400).send(e);
  });
});

//Parameters: None
//Purpose: Receives crawled indeed job data and updates in db
//Output: Crawled jobs are updated in the db
app.post('/indeed-update', async (req, res) => {
  var updatedJobs = req.body;
  try {
	const crawledJobs = await indeedUpdate.updateCrawledJobs(updatedJobs);
	if(!crawledJobs){
      return res.status(404).send();
	}
  await setJobsLastModified();
	res.status(200).send(crawledJobs);
	console.log('Received updated indeed job data');
  } catch (e) {
    res.status(400).send();
  }
  res.sendStatus(200);
});

app.post('/add-crawled', async (req, res) => {
  var newJobs = req.body;
  try {
	const crawledJobs = await addCrawled.addNewJobs(newJobs);
	if(!crawledJobs){
      return res.status(404).send();
	}
  await setJobsLastModified();
	res.status(200).send(crawledJobs);
	console.log('Received new job data');
  } catch (e) {
    res.status(400).send();
  }
});

// Request Parameters: userId, startIndex, endIndex for return job list
// Purpose: Gets the entire list of full job objects in the user's job queue, excluding ignored, applied, and buried jobs.
// Updates the queue with new jobs and reorders it if necessary.
app.get('/user/:u/job-queue/start/:s/end/:e', async (req, res) => {
  // await reorderJobQueue(req.username)
  res.status(200).send(await getJobQueue(req.params.u, req.params.s, req.params.e));
});

// Request Parameters: user id
// Purpose: Returns a 4-array array of [ [locationPreferences], [jobTitlePreferences], [keywordPreferences],
//                                      [<locationPriority>, <jobTitlePriority>, <keywordPriority>] ]
app.get('/user/:u/preferences', async (req, res) => {
  res.status(200).send(await getUserPreferences(req.params.u));
});


// Request parameters: _id from a user's document
// Purpose: Returns the user's list of applied jobs
app.get('/user/:u/applied-jobs', async (req, res) => {
  res.status(200).send(await getAppliedJobs(req.params.u));
});

// Request parameters: _id from a user's document
// Purpose: Returns the user's list of saved for later jobs
app.get('/user/:u/buried-jobs', async (req, res) => {
  res.status(200).send(await getBuriedJobs(req.params.u));
});

// Request Parameters: user id, job id of buried job to delete
// Removes that job id from the user's list of buried jobs
app.post('/user/:uid/buried-jobs/:jid/delete', async (req, res) => {
  await removeBuriedJob(req.params.uid, req.params.jid);
  res.sendStatus(200);
});

// Request parameters: _id from user's docuemnt and _id from a job docuemnt
app.get('/user/:uid/job-queue/delete/:jid', async (req, res) => {
  await deleteJobFromQueue(req.params.uid, req.params.jid);
  res.sendStatus(200);
});


// Deprecated. Only used for the midpoint demonstration
app.get('/next-top-jobs', async (req, res) => {
  var jobsList = await nextTopJobs(12, 'testuser', null);
  res.json(jobsList);
});

// Request parameters: userId, jobId
// Purpose: Adds that job id to the user's buried job list
app.post('/user/:u/bury-job/:j', async (req, res) => {
  await buryJob(req.params.u, req.params.j);
  res.sendStatus(200);
});

// Request parameters: username, jobId
// Purpose: Adds that job id to the user's applied jobs list
app.post('/user/:u/mark-applied/:j', async (req, res) => {
  await markApplied(req.params.u, req.params.j);
  res.sendStatus(200);
});

// Request parameters: userId, jobId
// Purpose: Adds that job id to the user's ignored jobs list
app.post('/user/:u/ignore-job/:j', async (req, res) => {
  await ignoreJob(req.params.u, req.params.j);
  res.sendStatus(200);
});

// Request Parameters: userId, preference object
// {"preference":  { "type": "jobField", "preference": "keyword", "strength": [-1,0,1,2,3] } }
// Purpose: Edits the strength entry of that preference in the user's document.
app.post('/user/:uid/search-preference/:pid/edit', async (req, res) => {
  //var preferenceIn = { type: req.params.t, preference: req.params.p, strength: req.params.s};
  const { type, strength, preference } = req.body
  var preferenceIn = { type: type, preference: preference, strength: strength};
  var returnPref = await editSearchPreference(req.params.uid, req.params.pid, preferenceIn);
  // await reorderJobQueue(req.username);
  await updateJobQueue(req.params.uid);
  res.status(200).send(returnPref);
});

// Request Parameters: userId, preference fields
// {"preference":  { "type": "jobField", "preference": "keyword", "strength": [-1,0,1,2,3] } }
// Purpose: Adds that preference in the user's document.
// Queries database for those jobs matching this preference and adds ids to user's job queue
app.post('/user/:uid/search-preference/add', async (req, res) => {
  const { type, strength, preference } = req.body
  var preferenceIn = { type: type, preference: preference, strength: strength};

  if(preferenceIn.type == 'location'){
    var commaIndex = await preference.indexOf(',');
    var citySegment = await preference.slice(0, commaIndex);
    var stateSegment = await preference.slice(commaIndex + 2);

	var geoData = await getGeo(citySegment, stateSegment);
	preferenceIn.geolocation = geoData.geolocation;
  }

  var returnPref = await addSearchPreference(req.params.uid, preferenceIn);
  

  await updateJobQueue(req.params.uid);
  
  //add user id for client to handle
  returnPref.userId = req.params.uid;
  
  res.status(200).send(returnPref);
});

// Request Parameters: userId, preference object fields
// {"preference":  { "type": "jobField", "preference": "keyword", "strength": [-1,0,1,2,3] } }
// Purpose: Removes that preference in the user's document and removes matching job IDs from their job queue
app.post('/user/:uid/search-preference/:pid/delete', async (req, res) => {
  const { type, strength, preference } = req.body
  var preferenceIn = { type: type, preference: preference, strength: strength};
  var returnPref = await deleteSearchPreference(req.params.uid, req.params.pid, preferenceIn);
  //await reorderJobQueue(req.params.uid);
  await updateJobQueue(req.params.uid);
  res.status(200).send(returnPref);
});


// Request Parameters: userId, priority weight p
// Purpose: Edits the location priority in that user's document to the specified priority
app.post('/user/:uid/edit-location-priority/:p', async (req, res) => {
  await editLocationPriority(req.params.uid, req.params.p);
  //await reorderJobQueue(req.params.u);
  await updateJobQueue(req.params.uid);
  res.sendStatus(200);
});

// Request Parameters: userId, priority (number)
// Purpose: Edits the job title priority in that user's document to the specified priority
app.post('/user/:uid/edit-job-title-priority/:p', async (req, res) => {
  await editJobTitlePriority(req.params.uid, req.params.p);
  //await reorderJobQueue(req.params.u);
  await updateJobQueue(req.params.uid);
  res.sendStatus(200);
});

// Request Parameters: userId, priority (number)
// Purpose: Edits the keyword priority in that user's document to the specified priority
app.post('/user/:uid/edit-keyword-priority/:p', async (req, res) => {
  await editKeywordPriority(req.params.uid, req.params.p);
  //await reorderJobQueue(req.params.u);
  await updateJobQueue(req.params.uid);
  res.sendStatus(200);
});


// Reqeust Parameters: user._id, job._id of applied job, note._id, and new noteText
// Purpose: Edits the note corresponding to a user's applied job
// Attach null to the note id if there has been no note added before.
app.post('/user/:uid/job/:jid/notes/:nid/edit', async (req, res) => {
  // console.log(req.params.uid);
  // console.log(req.params.jid);
  // console.log(req.params.nid);
  // console.log(req.body.note);
  var returnId = await editUserNote(req.params.uid, req.params.jid, req.params.nid, req.body.note);
  res.status(200).send(returnId);
});

// Request Parameters: note  id
// Purpose: Deletes that note from the db
app.post('/user/:uid/notes/:nid/delete', async (req, res) => {
  await deleteNote(req.params.uid, req.params.nid);
  res.sendStatus(200);
});


// Request Parameters: user id
// Purpose: Return an array of all that user's files (e.g. for user to choose from)
// Returns an empty array if they have no files uploaded
app.get('/user/:uid/files', async (req, res) => {
  res.status(200).send(await getUserFiles(req.params.uid));
});

// Request Parameters: user id, file id
// Get a single file object (belonging to a user)
app.get('/files/:fid', async (req, res) => {
  res.status(200).send(await getFile(req.params.fid));
});

// Request Parameters: user id, display name, file location (url in params)
// Purpose: Upload a "file" for the user to keep and associate
app.post('/user/:uid/files/upload', async (req, res) => {
  await addUserFile(req.params.uid, req.body.displayName, req.body.location);
  res.sendStatus(200);
});

// Request Parameters: user id, file id, new display name
// Purpose: editing the display name of a user's file
app.post('/user/:uid/files/:fid/display-name/edit', async (req, res) => {
  await editFileDisplayName(req.params.uid, req.params.fid, req.body.displayName);
  res.sendStatus(200);
});

// Request Parameters: user id, file id, new location (in params not url)
// Purpose: editing the location of a user's file
app.post('/user/:uid/files/:fid/location/edit', async (req, res) => {
  await editFileLocation(req.params.uid, req.params.fid, req.body.location);
  res.sendStatus(200);
});

// Request Parameters: file id
// Purpose: Removes a user's file from the db
app.post('/user/:uid/files/:fid/delete', async (req, res) => {
  await deleteFile(req.params.uid, req.params.fid);
  res.sendStatus(200);
});

// Request Parameters: file id, job id to associate
// Purpose: Lists the job in the file doc's list of associated jobs
app.post('/user/:uid/files/:fid/associate-job/:jid', async (req, res) => {
  await associateJob(req.params.uid, req.params.fid, req.params.jid);
  res.sendStatus(200);
});

// Request Parameters: file id, job id to unassociate
// Purpose: Removes the job from the file doc's list of associated jobs
// Undoes the action that associate-job endpoint does
app.post('/user/:uid/files/:fid/unassociate-job/:jid', async (req, res) => {
  await unassociateJob(req.params.uid, req.params.fid, req.params.jid);
  res.sendStatus(200);
});


// Request Parameters: username, password
// Purpose: Hashes the user's password and logs them in
// Returns user's id on successful login. null otherwise
app.post('/user/login', async (req, res) => {
  console.log(req.body);
  var loginResult = await userLogin(req.body.username, req.body.password);
  if (loginResult === 0) {
    return res.sendStatus(401);
  }
  res.status(200).send(JSON.stringify(loginResult));
  // Do extra stuff for session management
});

// Request Parameters: username, password
// Purpose: Sign up a new user
// Returns new user id if successful signup or null if username already exists
app.post('/user/signup', async (req, res) => {
  //console.log(req.body);
  var newUserId = await userSignup(req.body.username, req.body.password);
  //console.log(newUserId);
  if (newUserId) {
    if (req.body.locationPreference && req.body.jobTitlePreference) {
		//await console.log(JSON.stringify(req.body.locationPreference, null, 4));
      var locationName = req.body.locationPreference.preference;
      var commaIndex = await locationName.indexOf(',');
      var citySegment = await locationName.slice(0, commaIndex);
      var stateSegment = await locationName.slice(commaIndex + 2);

	  //await console.log(citySegment + " " + stateSegment)

	  var locationPreference = req.body.locationPreference;
	  var geoData = await getGeo(citySegment, stateSegment);
	  locationPreference.geolocation = geoData.geolocation;
	  if(geoData.valid == false){
		  console.log("An invalid location was entered");
	  }

      //await console.log(JSON.stringify(locationPreference, null, 4));
      await addSearchPreference(newUserId, locationPreference);
      await addSearchPreference(newUserId, req.body.jobTitlePreference);




      await editLocationPriority(newUserId, 3);
      await editJobTitlePriority(newUserId, 3);
      await editKeywordPriority(newUserId, 3);
      await updateJobQueue(newUserId);
    }
    res.status(200).send(newUserId);
  }
  else {
    res.status(200).send("null");
  }
});

// Request Parameters: user id
// Purpose: Sets that user as signed out in db
app.post('/user/:uid/logout', async (req, res) => {
  await userLogout(req.params.uid);
  res.sendStatus(200);
  // Do extra stuff for session management
});


app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
