const axios = require('axios');
const _ = require('lodash');
require('dotenv').config();

//The maximum possible job results by zip code is 1000
//A lower number is used to resolve scaling issues on heroku server
const maxJobResults = 600;

//The maximum number of results per api call is 25
const maxResultsPerCall = 25;

//Parameters: Job Data from Indeed API
//Purpose: Object Constructor for Job for insertion into DB
//Output: Constructor for new Job object
function Job(jobtitle, company, city, state, date, snippet, url, latitude, longitude, jobkey, jobtype){
  this.jobtitle = jobtitle;
  this.company = company;
  this.city = city;
  this.state = state;
  this.date = date;
  this.snippet = snippet;
  this.url = url;
  this.latitude = latitude;
  this.longitude = longitude;
  this.jobkey = jobkey;
  this.jobtype = jobtype;
  this.source = "Indeed";
  this.crawled = false;
  this.geolocation = new Object();
  this.geolocation.type = "Point";
  this.geolocation.coordinates = [longitude, latitude];
};


//A zip code list whereby each zip code represents the center of a 100 mile radius circle
//all circles combined cover the Pacific Northwest (WA, OR, ID)
var pacificNorthwestZips = [
  "97101", "83332", "97910", "97640", "97442", "97071",
  "97864", "97850", "83469", "83446", "83541", "99349",
  "99114", "98548", "98281", "98862", "83657", "83234"
  ];

//A list of all the job types on indeed
var jobTypes = [
  "fulltime", "parttime", "contract", "internship", "temporary"
  ];

//Parameters:
//  from - starting job number for API
//  zip - zip code to query
//  jobsToGet - the number of jobs to fetch (max 25)
//Purpose: Gets a set number of jobs from the indeed API based on zip/starting job
//Output: A list of Indeed API jobs
const getLocalJobs = async (from, zip, jobsToGet, jobType) => {

  try{
    var url = "http://api.indeed.com/ads/apisearch?publisher="
    + process.env.INDEED_API_KEY
    + "&limit="
    + jobsToGet
    + "&fromage=1&latlong=1&co=us&userip=1.2.3.4&useragent=Mozilla/%2F4.0%28Firefox%29&v=2&format=json&radius=100&start="
    + from
    + "&l="
    + zip
	+ "&jt="
	+ jobType;

    const response = await axios.get(url);
    var parsedResponse = response.data.results;


    if(parsedResponse.length >= 0){
      return parsedResponse;
    }
    else{
      throw new Error();
    }
  } catch (e) {
	console.log("API Call w/ Error: " + url);
    throw new Error("Unable to fetch job results from Indeed");
  }
};

//Parameters: zip - the zip code to check
//Purpose: Determines the number of new jobs within 100 miles of a given zip code
//Output: A number reflecting how many new jobs are available within 100 miles
const getNumLocalJobs = async (zip, jobType) => {
  try{
    var url =
	"http://api.indeed.com/ads/apisearch?publisher="
	+ process.env.INDEED_API_KEY
	+ "&limit=1&fromage=1&latlong=1&co=us&userip=1.2.3.4&useragent=Mozilla/%2F4.0%28Firefox%29&v=2&format=json&start=0&radius=100&l="
	+ zip
	+ "&jt="
	+ jobType;

    const response = await axios.get(url);
    var totalResults = response.data.totalResults;

    //The indeed api returns a max of 1000 results in a search
    if(totalResults >= maxJobResults){
      return maxJobResults;
    }
    else if(totalResults >= 0 ){
      return totalResults;
    }
    else {
      throw new Error();
    }

  } catch (e) {
    throw new Error("Unable to fetch total number of local jobs");
  }
}

//Parameters : None
//Purpose: Pull all the jobs from the Pacific Northwest published the previous day
//Output: Returns a list of job objects
const pullIndeedJobs = async () => {

  var filteredJobList = []

  //use a loop to check an array of zip codes covering the Pacific Northwest (ID, OR, WA) with 100 mile radius zones
  for(currJobType = 0; currJobType < jobTypes.length; currJobType++){
	var jobList = [];

    for(searchLocation = 0; searchLocation < pacificNorthwestZips.length; searchLocation++){
      totalResults = await getNumLocalJobs(pacificNorthwestZips[searchLocation], jobTypes[currJobType]); //determines the total results for a zip code

      for(i = 0; i < totalResults; i += maxResultsPerCall){

        var numjobs = 0;
        //Addresses odd API behavior if requesting more jobs than are available
        if(totalResults - i < maxResultsPerCall){
          numJobs = totalResults - i;
        }
        else{
          numJobs = maxResultsPerCall;
        }

        var returnedJobs = await getLocalJobs(i, pacificNorthwestZips[searchLocation], numJobs, jobTypes[currJobType]);

        jobList = await jobList.concat(returnedJobs);

      }
    }

    //filter out any duplicate jobs by jobkey
    jobList = await _.uniqBy(jobList, "jobkey");

    //create an array of job objects from data pulled from the indeedAPI
    for(i = 0; i < jobList.length; i++){
      if(jobList[i].state == "ID" || jobList[i].state == "WA" || jobList[i].state == "OR" ){
        await filteredJobList.push(new Job(
          jobList[i].jobtitle,
          jobList[i].company,
          jobList[i].city,
          jobList[i].state,
          jobList[i].date,
          jobList[i].snippet,
          jobList[i].url,
          jobList[i].latitude,
          jobList[i].longitude,
          jobList[i].jobkey,
		  jobTypes[currJobType]
          ));
      }
    }

  }
  //Filters out duplicate jobs from filteredJobList
  filteredJobList = await _.uniqBy(filteredJobList, "jobkey");

  return filteredJobList;
};

//Parameters : None
//Purpose: Runs a test of pullIndeedJobs
//Output: Prints to console
const updateAllJobsTest = async () => {
	return await pullIndeedJobs();
}

/*
//Parameters : None
//Purpose: Runs pullIndeed Jobs
//Output: Inserts all the jobs into the database
const updateAllJobs = async () => {
	jobsList = await pullIndeedJobs();

	addNewJobs.addNewJobs(jobList[0]);
}*/

//this just runs the job search for testing, it can be removed later
updateAllJobsTest().then((jobs) => {
  console.log(jobs);
  console.log(jobs.length);
  //return jobs

}).catch((e) => {
  console.log(e);
});


module.exports = {
  //updateAllJobs,
  pullIndeedJobs
};