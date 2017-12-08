import React, { Component } from 'react';
import Note from './Note';


var JobHeader = function(props) {
  return(
    <div className="job-header text-center p-5 col-12">
      <h2>{props.jobTitle}</h2>
      <p><a className="text" href={props.url}>{props.url}</a></p>
    </div>
  )
}

var createMarkup = (text) => {
  return {__html: text};
}

var JobBody = function(props) {
  var { jobData } = props;

  return(
    <div className="job-body col-12">
      {jobData.company ? <p className="text"><b className="category">Company Name:</b> {jobData.company}</p> :  <span />}
      {jobData.city ? <p className="text"><b className="category">City:</b> {jobData.city}</p> :  <span />}
      {jobData.state ? <p className="text"><b className="category">State:</b> {jobData.state}</p> :  <span />}
      {jobData.date ? <p className="text"><b className="category">Date Posted:</b> {jobData.date}</p> :  <span />}
      {jobData.salary ? <p className="text"><b className="category">Salary:</b> {jobData.salary}</p> :  <span />}
      {jobData.experience ? <p className="text"><b className="category">Minimum Experience:</b> {jobData.experience}</p> :  <span />}
      {jobData.jobType ? <p className="text"><b className="category">Job Type:</b> {jobData.jobType}</p> : <span />}
      <br />
      {jobData.body ? <p className="text"><b className="category">Details:</b><div className="text" dangerouslySetInnerHTML={createMarkup(jobData.body)}></div></p> : <span />}
    </div>
  )
}



export default class JobView extends Component{
  render() {
    var { jobData } = this.props;
    return(
      <div id="job-view" className="col-sm-8 float-center">
        <JobHeader jobTitle={jobData.jobTitle} url={jobData.url} />
        <JobBody jobData={jobData} />
        <Note
          jobId={jobData._id}
          noteId={jobData.noteId || null}
          note={jobData.noteText}
          handleClick={this.props.handleNoteChange}
          _id={this.props._id}
        />
      </div>
    )
  }
}
