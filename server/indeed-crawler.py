import requests
import random
from time import sleep

#Parameters: An uncrawled job dictionary pulled from the database
#Purpose: Will update the url if it has a non-indeed url, as well as pull the body of the job posting and set crawled to true
#Output: Returns an updated dictionary
def crawlJob(job):
    r = requests.get(job['url'])

    job_body = r.text


    if("Job not found" in job_body):
        #The job has been removed since crawled
        job['body'] = "This job is no longer available"
    else:
        #Parses and updates the job's body
        spanName = "<span id=\"job_summary\" class=\"summary\">"
        job_body = job_body[job_body.find(spanName) + len(spanName):]
        job_body = job_body[:job_body.find("</span>")]

        #adds an opening <b> character if there is a </b> before any <b>
        if ("</b>" in job_body):

            if (job_body.find("<b>") == -1 or job_body.find("<b>") > job_body.find("</b>")):
                job_body = "<b>" + job_body

        job['body'] = job_body

        #If there is a link to the original job posting, capture that url (it is an indeed.com link that redirects)
        if("original job</a></span>" in r.text):
            original_url = r.text
            original_url= original_url[:original_url.find("original job</a></span>")]
            original_url = original_url[original_url.find("<span>"):]
            original_url = original_url[original_url.find(" href=\"") + len(" href=\""):]
            original_url = original_url[:original_url.find("&")]
            original_url = "http://www.indeed.com" + original_url

            job['url'] = original_url

    job['crawled'] = True

    return job

random.seed()

#Requests the uncrawled Indeed jobs from the server
uncrawledJobs = requests.get('https://aquarius467.herokuapp.com/indeed-uncrawled')

#converts uncrawledJobs to JSON
jobList = uncrawledJobs.json()

#Prints the request status
print("Job Pull Status: " + str(uncrawledJobs))

#Results in a payload of 'end' updated jobs
#Cautious if increasing, large number of jobs in payloads were rejected for being too large
start = 0
end = 5

while(start < len(jobList)):
    tempJobList = jobList[start:end]

    crawledJobs = []

    #Crawls every url in tempJobList
    #Sleep delays crawler - runs 5-20 pages per second
    for i in range(0, len(tempJobList)):
        crawledJobs.append(crawlJob(tempJobList[i]))
        sleep(random.randrange(5, 20)/100)

    #Sends payload of crawled jobs back to server for updating
    response = requests.post('https://aquarius467.herokuapp.com/indeed-update', json=crawledJobs)

    start += 5
    if(end + 5 > len(jobList)):
        end = len(jobList)
    else:
        end += 5

print("Job Updates Completed - " + str(len(jobList)) + " Jobs Updated")





