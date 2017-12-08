var indeed = require('../indeed/indeed');
var addIndeedJobs = require('./addNewJobs');

//Parameters: None
//Purpose: Pulls the new jobs from Indeed and adds to the db
//Output: New indeed jobs are added to the db
const updateIndeedJobs = async () => {
  try{
    const newJobs = await indeed.pullIndeedJobs();
	if(newJobs.length > 0){
      addIndeedJobs.addNewJobs(newJobs);
	}
  } catch (e) {
	  throw new Error('Unable to pull new Indeed jobs');
  }

}

//Parameters: None
//Purpose: Called by Heroku Scheduler to run the various scheduled jobs
//Output: None
const runScheduledJobs = async () => {
	await updateIndeedJobs();

	console.log("Scheduled Jobs Completed");
}

runScheduledJobs();