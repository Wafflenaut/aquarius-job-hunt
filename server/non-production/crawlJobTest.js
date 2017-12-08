var execFile = require('child_process');

const crawlJobsTest = () => {
  try{
    console.log('Attempting to run python script');
    const child = execFile('python', ['indeed-crawler.py']);
    console.log('Just finished python script');	
  } catch (e) {
    throw new Error('Unable to crawl Indeed jobs');
  }
}


const runJobTest = () => {
	crawlJobsTest();
	console.log("Scheduled Jobs Completed");
}

runJobTest();