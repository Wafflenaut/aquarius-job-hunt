import requests
import datetime
from html import unescape
from datetime import timedelta
from time import sleep
import random
import re
from geojson import Point

#Class: Contains various functions for crawling employer career pages for jobs
class Employer():
    def __init__(self, _employerName):
        self.urls = []
        self.employer = _employerName
        self.dateList = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    #Parameters: A list of urls that cover the initial career page urls to scan
    #Purpose: Stores a list of urls to access later
    #Output: N/A
    def setBaseUrls(self, _urls):
        self.urls = list(_urls)

    #Parameters: the body of a webpage, number representing the nth occurence of the tag and the text inside a tag < >
        #desired tag e.g. ul for <ul>
    #Function: Finds the Nth <_tag> tag in the body
        #Note: Does not work if there are intervening tags of the same type
    #Output: Returns the text/markup within Nth element of type tag
    def getNthElement(self, _body, _nth, _tag):

        tag = "<" + _tag
        index = 0
        for i in range(0, _nth):
            index = _body.find(tag, index)\


            if(index == -1):
                return ""
            else:
                index += len(tag)

        #find end of tag
        index = _body.find('>', index) + 1

        element = _body[index: _body.find('</' + _tag + '>', index)]
        return element

    #Parameters: a body and string representing a tag inside < >
    #Purpose:  Finds all matching tags within the body
        # Note: Does not work if there are intervening tags of the same type
    #Output: Returns a list of the text/markup within all the matching tags
    def returnAllTags(self, _body, _tag):
        allEntries = []
        finished = False
        index = 0

        tag = "<" + _tag

        while(not finished):
            index = _body.find(tag, index)
            if(index == -1):
                finished = True
            else:
                index += len(tag) + 1
                entry = _body[index: _body.find("</" + _tag + ">", index)]
                allEntries.append(entry)

        return allEntries

    #Parameters: a body of text and the nth link to pull
    #Purpose: pull a link from a body
    #Output: returns a string representing the nth url in the body
    def returnNthUrl(self, _body, _nth):
        index = 0

        for i in range(0, _nth):
            index = _body.find("href=\"", index) + len("href=\"")
            if(index == -1):
                return ""

            url = _body[index:_body.find("\"", index)]

            return url

    #Parameters: a body of text and a string representing a class name
    #Purpose: return a link with a matching class
    #Output: returns a url string representing the first link with class _class
    def returnFirstLinkClass(self, _body, _class):
        done = False
        index = 0

        while(not done):
            index = _body.find("<a", index)

            if(index == -1):
                return ""
            else:
                index += 1 + len("<a")
                tagEnd = _body.find(">", index)
                if(tagEnd == -1):
                    return ""

                classIndex = _body.find("class", index, tagEnd)
                if(classIndex != -1):
                    endQuote = _body.find("\"", classIndex) + 1
                    endQuote = _body.find("\"", endQuote)

                    if(_body.find(_class, classIndex, endQuote) != -1):
                        hrefIndexStart = _body.find("href", index)
                        hrefIndexStart = _body.find("\"", hrefIndexStart) + 1
                        hrefIndexEnd = _body.find("\"", hrefIndexStart)
                        if(hrefIndexStart == -1 or hrefIndexEnd == -1):
                            return ""
                        url = _body[hrefIndexStart: hrefIndexEnd]

                        return url
                    else:
                        index = tagEnd + 1
                else:
                    index = tagEnd + 1

    #Parameters: string of body text, a string for a tag inside < > and a class to search for
    #Purpose: Returns the contents of the first tag with the matching class
    #Output: Returns the string text/markup contents of the matching tag
    def returnFirstTagClass(self, _body, _tag, _class):
        done = False
        index = 0

        while(not done):
            index = _body.find("<" + _tag, index) + 1 + len(_tag)

            if(index == -1):
                return ""
            else:
                tagEnd = _body.find(">", index)
                if(tagEnd == -1):
                    return ""

                classIndex = _body.find("class", index, tagEnd)
                if(classIndex != -1):
                    endQuote = _body.find("\"", classIndex) + 1
                    endQuote = _body.find("\"", endQuote)

                    if(_body.find(_class, classIndex, endQuote) != -1):
                        textStart = _body.find(">", endQuote) + 1
                        textEnd = _body.find("</" + _tag + ">", textStart)

                        text = _body[textStart: textEnd]

                        return text
                    else:
                        index = endQuote
                else:
                    index = tagEnd

    #Parameters: a string of a text body
    #Purpose: returns the first href info (pulls href, not <a>
    #Output: returns text of the first href url as a string
    def returnFirstHREF(self, _body):
        startIndex = _body.find("href=\"") + len("href=\"")
        endIndex = _body.find('\"', startIndex)

        return _body[startIndex:endIndex]

    #Parameters: a string of body text, a string of the tag type < >, a string of class, and a number for nth
    #Purpose:  Searches for and returns the nth instance of a class in the text
    #Output:  Returns the text/markup of the nth tag with matching class as a string
    def returnNthTagClassNested(self, _body, _tag, _class, _nth):
        done = False
        index = 0
        current = 1

        while (not done):
            index = _body.find("<" + _tag, index) + 1 + len(_tag)

            if (index == -1):
                return ""
            else:
                #A matching tag was found
                tagEnd = _body.find(">", index)
                if (tagEnd == -1):
                    return ""

                classIndex = _body.find("class", index, tagEnd)
                if (classIndex != -1):
                    #matching class was found before end of tag
                    endQuote = _body.find("\"", classIndex) + 1
                    endQuote = _body.find("\"", endQuote)

                    if (_body.find(_class, classIndex, endQuote) != -1):
                        if(current == _nth):
                            #the nth class was found
                            textStart = _body.find(">", endQuote) + 1
                            endOfTag = False
                            nextTagStart = textStart
                            nextTagEnd = textStart

                            while(endOfTag == False):
                                nextTagStart = _body.find("<" + _tag, nextTagStart)
                                nextTagEnd = _body.find("</" + _tag, nextTagEnd)
                                if(nextTagEnd == -1):
                                    return ""
                                elif(nextTagEnd < nextTagStart):

                                    text = _body[textStart: nextTagEnd]

                                    return text

                                nextTagStart += len(_tag) + 1
                                nextTagEnd += len(_tag) + 2


                        else:
                            #a matching class has been found
                            current += 1
                    else:
                        index = endQuote
                else:
                    index = tagEnd

    # Parameters: a string of body text, a string of the tag type < >, a string of class, and a number for nth
    # Purpose:  Searches for and returns the nth instance of a class in the text
    # Output:  Returns the text/markup of the nth tag with matching class as a string
    def returnNthTagClass(self, _body, _tag, _class, _nth):
        done = False
        index = 0
        current = 1

        while (not done):
            index = _body.find("<" + _tag, index) + 1 + len(_tag)

            if (index == -1):
                return ""
            else:
                tagEnd = _body.find(">", index)
                if (tagEnd == -1):
                    return ""

                classIndex = _body.find("class", index, tagEnd)
                if (classIndex != -1):
                    endQuote = _body.find("\"", classIndex) + 1
                    endQuote = _body.find("\"", endQuote)

                    if (_body.find(_class, classIndex, endQuote) != -1):
                        if (current == _nth):
                            textStart = _body.find(">", endQuote) + 1
                            textEnd = _body.find("</" + _tag + ">", textStart)
                            text = _body[textStart: textEnd]

                            return text
                        else:
                            # a matching class has been found
                            current += 1
                    else:
                        index = endQuote
                else:
                    index = tagEnd


    #Parameters: Body text string and id text string
    #Purpose: Searches for and returns the item with a matching id
        # Note: Does not work if there are intervening tags
    #Output: Returns text/markup of contents of tag with the matching id
    def returnId(self, _body, _id):

        index = _body.find("id=\"" + _id + "\"")

        if(index == -1):
            return ""
        else:
            index = _body.find(">", index)

            if(index == -1):
                return ""
            else:
                textEnd = _body.find("<", index)

                if(textEnd != -1):
                    return _body[index + 1:textEnd]
                else:
                    return ""

    #Parameters: Body text string and itemprop text string
    #Purpose: Searches for and returns the item with a matching itemprop
        # Note: Does not work if there are intervening tags
    #Output: Returns text/markup of contents of tag with the matching id
    def returnItemProp(self, _body, _itemProp):

        index = _body.find("itemprop=\"" + _itemProp + "\"")

        if(index == -1):
            return ""
        else:
            index = _body.find(">", index)

            if(index == -1):
                return ""
            else:
                textEnd = _body.find("<", index)

                if(textEnd != -1):
                    return _body[index + 1:textEnd]
                else:
                    return ""

    #Parameters: Body text string, text content string, and a closing tag
    #Purpose: Returns content from the end of textContent to the closing tag passed in
    #Output: Returns text/markup between search text and closing tag as a string
    def returnToEndOfCategory(self, _body, _textContent, _tagClose):
        startParse = _body.find(_textContent)

        if(startParse == -1):
            return ""
        else:
            startParse += len(_textContent)
            endParse = _body.find("</" + _tagClose + ">", startParse + 1)
            tempBody = _body[startParse:endParse]
            tempBody = self.removeTags(tempBody)
            tempBody = tempBody.lstrip()

            return tempBody


    #Parameters: Body text string
    #Purpose: Lowercases tags (for poor quality html input sources)
    #Output: Returns body text with all the tags lowercased
        #Note: Will lowercase text enclosed by < and > that is not true tags
    def lowercaseTags(self, _body):
        modifiedBody = ""
        startIndex = 0
        endIndex = 0

        while(startIndex != -1):
            startIndex = _body.find('<', startIndex)
            modifiedBody += _body[endIndex:startIndex]
            endIndex = _body.find('>', startIndex)
            modifiedBody += _body[startIndex:endIndex].lower()
            startIndex = endIndex

        return modifiedBody

    #Parameters: Body text string
    #Purpose: Remove < > and the text/markup they enclose
    #Output: Returns body with all tags removed
        #Note: May encounter issues with < and > in text
    def removeTags(self, _body):
        modifiedBody = ""
        startIndex = 0
        endIndex = 0

        while(endIndex != -1):
            endIndex = _body.find('<', startIndex)
            if (endIndex != -1):
                modifiedBody += _body[startIndex:endIndex]
                startIndex = _body.find('>', endIndex) + 1


        modifiedBody += _body[startIndex:]

        return modifiedBody




#Parameters: N/A
#Purpose: Crawl Boeing Careers Page for new jobs
#Output: Returns a list of new boeing job Dict items
def crawlBoeing():
    Boeing = Employer("Boeing")

    yesterday = datetime.datetime.today() - timedelta(days=1)
    Boeing.setBaseUrls(['https://jobs.boeing.com/location/washington-jobs/185/6252001-5815135/3',
                        'https://jobs.boeing.com/location/oregon-jobs/185/6252001-5744337/3'])
    pageList = list(Boeing.urls)
    crawlCount = len(Boeing.urls)
    urlsToCrawl = []
    boeingJobs = []


    i = 0
    while(i < crawlCount):
        crawledAll = False
        page = requests.get(pageList[i]).text
        crawledUrl = "https://jobs.boeing.com" + Boeing.returnFirstLinkClass(page, "next")
        if(crawledUrl != "https://jobs.boeing.com" and crawledUrl != pageList[i]):
            crawlCount += 1
            pageList.append(crawledUrl)
        i += 1


    for i in range(0, len(Boeing.urls)):
        r = requests.get(Boeing.urls[i])
        jobPage = r.text
        jobPage = Boeing.getNthElement(jobPage, 10, "ul")
        jobItemList = Boeing.returnAllTags(jobPage, "li")

        for job in jobItemList:
            jobDate = Boeing.returnFirstTagClass(job, "span", "job-date-posted")
            jobDate = jobDate.split('/')

            #strip leading 0s
            jobDate[0] = str(int(jobDate[0]))
            jobDate[1] = str(int(jobDate[1]))

            if(jobDate[0] == str(yesterday.month) and jobDate[1] == str(yesterday.day) and jobDate[2] == str(yesterday.year)):
                urlsToCrawl.append('https://jobs.boeing.com' + Boeing.returnNthUrl(job, 1))

    #print(urlsToCrawl)

    for url in urlsToCrawl:
        job = dict()
        jobText = requests.get(url).text
        job['jobtitle'] = unescape(Boeing.getNthElement(jobText, 2, 'h1'))
        job['company'] = 'Boeing'

        city = Boeing.returnNthTagClass(jobText, 'span', 'city', 1)
        state = Boeing.returnNthTagClass(jobText, 'span', 'city', 2)
        job['city'] = city
        job['state'] = state

        job['date'] = yesterday.strftime("%a, %d %b %Y 11:59:59 EST")
        job['crawled'] = True
        job['url'] = url
        job['source'] = 'Boeing'

        key = Boeing.returnFirstTagClass(jobText, 'span', 'job-id')
        job['jobKey'] = key[key.find("</b> ") + len("</b> "):]

        tempBody = Boeing.returnNthTagClass(jobText, 'span', 'job-date job-info', 4)
        body = tempBody + Boeing.returnNthTagClass(jobText, 'div', 'custom-fields', 2)
        job['body'] = body

        body = Boeing.removeTags(body)
        body = unescape(body)

        if(' Intern ' in body):
            job['jobtype'] = 'internship'
        else:
            job['jobtype'] = 'fulltime'


        job['snippet'] = tempBody[:tempBody[:160].rfind(' ')]

        job['snippet'] = job['snippet'] + '...'

        job['snippet'] = job['snippet'].replace('\n', '')

        boeingJobs.append(job)


        #check if there are other locations on the page, if so, add entries for them as well
        if(jobText.find('Other Locations') != -1):
            otherLocs = Boeing.returnToEndOfCategory(jobText, "Other Locations", "span")
            otherLocs = otherLocs.strip('~')
            otherLocs = otherLocs.split('~')
            tempLocationList = []

            for location in otherLocs:
                tempLocationList.append(location.split(';'))

            otherValidLocations = []

            for location in tempLocationList:
                if(location[1].lstrip() == 'Oregon' or location[1].lstrip() == 'Washington'):
                    tempLoc = []
                    tempLoc.append(location[0])
                    tempLoc.append(location[1])
                    otherValidLocations.append(tempLoc)

            for location in otherValidLocations:
                tempJob = dict(job)
                tempJob['city'] = location[0]
                tempJob['state'] = location[1]
                boeingJobs.append(tempJob)



    #deletes duplicates from the list, as boeing jobs can appear under multiple states with the same entry
    while(i  < len(boeingJobs) - 1):
        if(boeingJobs[i] in boeingJobs[i+1:]):
            del boeingJobs[i]
        else:
            i += 1


    return boeingJobs

#Parameters: N/A
#Purpose: Crawls Micron's job pages for new jobs
#Output: Returns a list of new Micron jobs in dict format
def crawlMicron():
    Micron = Employer("Micron")

    yesterday = datetime.datetime.today() - timedelta(days=1)
    pageUrl = 'https://jobs.micron.com/search/?q=&location=ID&startrow='
    pageList = []
    urlsToCrawl = []

    i = 0
    endOfResults = False
    while(endOfResults == False):

        crawledAll = False
        page = requests.get(pageUrl + str(i)).text

        if('There are currently no open positions matching' in page):
            endOfResults = True
        else:
            pageList.append(pageUrl + str(i))
            i += 25

    pageList[0] = pageUrl + '0'

    foundValidDate = False
    invalidDateReached = False
    i = 0
    while(invalidDateReached == False and i < len(pageList)):
        page = requests.get(pageList[i]).text
        page = Micron.getNthElement(page, 1, 'tbody')
        jobList = Micron.returnAllTags(page, 'tr')
        validDate = yesterday.strftime('%b ') + yesterday.strftime('%d, %Y').lstrip('0')

        for job in jobList:

            currDate = Micron.returnFirstTagClass(job, 'span', 'jobDate').rstrip()

            if(validDate == currDate):
                foundValidDate = True
                urlsToCrawl.append('https://jobs.micron.com' + Micron.returnFirstLinkClass(job, 'jobTitle-link'))
            elif(foundValidDate == True):
                invalidDateReached = True
                break

        i += 1

    micronJobs = []

    for url in urlsToCrawl:
        job = dict()
        jobText = requests.get(url).text
        job['jobtitle'] = unescape(Micron.returnId(jobText, 'job-title'))
        job['company'] = 'Micron'

        tempLocation = Micron.returnItemProp(jobText, 'jobLocation')
        tempLocation = tempLocation.split(',')
        job['city'] = tempLocation[0]
        job['state'] = tempLocation[1]
        job['date'] = yesterday.strftime("%a, %d %b %Y 11:59:59 EST")

        job['source'] = 'Micron'
        job['url'] = url
        job['crawled'] = True


        job['body'] = Micron.returnNthTagClass(jobText, 'div', 'job', 4)

        if('Intern' in Micron.returnItemProp(jobText, 'industry')):
            job['jobtype'] = 'internship'
        else:
            job['jobtype'] = 'fulltime'

        #pulls the 4th div with job in the class and converts contents to a list of paragraphs
        paraList = Micron.returnAllTags(Micron.returnNthTagClass(jobText, 'div', 'job', 4), 'p')
        tempBody = ""

        for para in paraList:
            tempBody += para

        job['snippet'] = tempBody[:tempBody[:160].rfind(' ')]
        job['snippet'] = job['snippet'] + '...'
        job['snippet'] = job['snippet'].replace('\n', '')
        job['snippet'] = Micron.removeTags(job['snippet']).lstrip()

        micronJobs.append(job)

    return micronJobs


#Parameters: N/A
#Purpose: Crawl FredMeyer job pages for new jobs
#Output: A list of new Fred Meyer jobs in dict format
def crawlFredMeyer():
    random.seed()
    FredMeyer = Employer("FredMeyer")

    yesterday = datetime.datetime.today() - timedelta(days=1)

    urlPrefix = 'https://jobs.kroger.com/fred-meyer/go/Fred-Meyer/587600/'
    FredMeyer.setBaseUrls(['/?q=&q2=&locationsearch=&title=&location=ID&facility=&department=',
                        '/?q=&q2=&locationsearch=&title=&location=WA&facility=&department=',
                           '/?q=&q2=&locationsearch=&title=&location=%22OR%22&facility=&department='])

    pageList = list(FredMeyer.urls)
    allJobLists = []
    urlsToCrawl = []
    FredMeyerJobs = []

    #generate list of all job list pages
    for page in pageList:
        pageStart = 0
        endOfJobsReached = False
        #For speed's sake - keeps number of job pages searched to 4 (75)
        #In the unlikely event more than 100 new jobs posted in last day, this will miss some
        while(endOfJobsReached == False and pageStart <= 75):
            pageText = requests.get(urlPrefix + str(pageStart) + page).text
            if('There are currently no open positions matching' in pageText):
                endOfJobsReached = True
            else:
                allJobLists.append(urlPrefix + str(pageStart) + page)
                pageStart += 25


    #Crawls all jobs posted on the Fred Meyer site in WA, ID, OR
    #Fred Meyer does not list dates posted on their career pages, so every page must be checked
    for jobList in allJobLists:

        body = requests.get(jobList).text
        body = FredMeyer.getNthElement(body, 1, 'tbody')
        body = FredMeyer.returnAllTags(body, 'a')

        for link in range(0, len(body)):
            #Fixes bug with duplicate urls due to nested double urls in source code of FredMeyer site
            if(link % 2 == 0):
                urlsToCrawl.append('https://jobs.kroger.com' + FredMeyer.returnFirstHREF(body[link]))

    for url in urlsToCrawl:

        validDate = yesterday.strftime('%b ') + yesterday.strftime('%d, %Y').lstrip('0')
        jobText = requests.get(url).text
        jobDate = FredMeyer.returnItemProp(jobText, 'datePosted').strip()

        #If job's date is valid (yesterday) - create a new job item
        if(validDate == jobDate):
            job = dict()
            job['jobtitle'] = FredMeyer.returnId(jobText, 'job-title')
            job['company'] = 'Fred Meyer'
            location = FredMeyer.returnItemProp(jobText, 'jobLocation').split(',')
            job['city'] = location[0]
            job['state'] = location[1].lstrip()
            job['date'] = yesterday.strftime("%a, %d %b %Y 11:59:59 EST")

            job['crawled'] = True
            job['source'] = 'FredMeyer'
            job['url'] = url



            #pulls the 'industry' section which has some keywords and job data
            industryText = FredMeyer.returnItemProp(jobText, 'industry')
            if ('Seasonal' in industryText):
                job['jobtype'] = 'temporary' #check this
            elif('Part Time' in industryText):
                job['jobtype'] = 'parttime'
            else:
                job['jobtype'] = 'fulltime'

            #Pulls all paragraphs in the 4th div with 'job' in the class, then converts all paragraphs within to a list
            paraList = FredMeyer.returnAllTags(FredMeyer.returnNthTagClass(jobText, 'div', 'job', 4), 'p')

            tempBody = ""
            for para in range(1, len(paraList)):
                tempBody += paraList[para]


            tempBody = FredMeyer.removeTags(tempBody).lstrip()

            tempBody = re.sub('\s+', ' ', tempBody).strip()

            if(tempBody.find('>') < 160):
                tempBody = tempBody[tempBody.find('>') + 1:]

            tempBody = re.sub( '\s+', ' ', tempBody).strip()
            job['snippet'] = tempBody[:tempBody[:160].rfind(' ')]

            job['snippet'] = job['snippet'] + '...'
            job['snippet'] = job['snippet'].replace('\n', '')

            job['snippet'] = job['snippet'].replace('\xa0', ' ')
            job['snippet'] = job['snippet'].replace('\r', ' ')


            job['body'] = FredMeyer.returnNthTagClass(jobText, 'div', 'job', 4)

            FredMeyerJobs.append(job)

        #as this has to crawl ALL jobs - adding a small delay as it can spam their servers
        sleep(random.randrange(5, 20) / 100)

    return FredMeyerJobs

def getGeoLoc(city, state, key):
    geocodeUrl = 'http://dev.virtualearth.net/REST/v1/Locations?CountryRegion=US&adminDistrict=' + state + '&locality=' + city + '&key=' + apiKey

    r = requests.get(geocodeUrl).json()

    coords = r.get('resourceSets', {})[0].get('resources', {})[0].get('geocodePoints', {})[0].get('coordinates', {})

    return coords

newJobs = []
try:
    newJobs = newJobs + crawlFredMeyer()
    print('Done Fred')
except:
    print('Error Crawling Fred Meyer')

try:
    newJobs = newJobs + crawlMicron()
    print('Done Micron')
except:
    print('Error Crawling Micron')

try:
    newJobs = newJobs + crawlBoeing()
    print('Finished Crawling Jobs: ' + str(len(newJobs)) + " new jobs added.")
except:
    print('Error Crawling Boeing')

#f = open('bing-maps-key', 'r') #for when running on desktop
f = open('./server/bing-maps-key', 'r')
apiKey = f.read()
random.seed()
for job in newJobs:
    geoLoc = getGeoLoc(job['city'], job['state'], apiKey)

    job['latitude'] = geoLoc[0]
    job['longitude'] = geoLoc[1]
    job['geolocation'] = Point((geoLoc[1], geoLoc[0]))
    sleep(random.randrange(5, 20) / 100)


start = 0
if(len(newJobs) >= 5):
    end = 5
else:
    end = len(newJobs)

#Adds new jobs 5 at a time to keep within server request size limits
while(start < len(newJobs)):
    tempJobList = newJobs[start:end]

    response = requests.post('https://aquarius467.herokuapp.com/add-crawled', json=tempJobList)

    start += 5
    if(end + 5 > len(newJobs)):
        end = len(newJobs)
    else:
        end += 5


