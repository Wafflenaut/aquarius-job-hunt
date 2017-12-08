import React, { Component } from 'react';
import { ModalHeader, ModalBody } from 'reactstrap';


/*
  Presentational component for that appears on view details
  Input - jobData and daysSincePost
*/
export default class DetailModal extends Component {
  createMarkup = () => {
    return {__html: this.props.jobData.body};
  }

  render() {
    const {jobData} = this.props;

    return(
      <div className="detail-modal modal-lg container-fluid mt-xs-5">
        <ModalHeader toggle={this.props.toggle}>
          <p>{jobData.jobTitle} - {jobData.company}</p>
        </ModalHeader>
        <ModalBody className="job-body row no-gutters">
          <a className="text col-12 m-2" href={jobData.url} target="_origin">View the Original Ad</a>
          {jobData.company ? <p className="text col-12"><b className="category">Company Name:</b> {jobData.company}</p> :  <span />}
          {jobData.city ? <p className="text col-12"><b className="category">City:</b> {jobData.city}</p> :  <span />}
          {jobData.state ? <p className="text col-12"><b className="category">State:</b> {jobData.state}</p> :  <span />}
          {jobData.date ? <p className="text col-12"><b className="category">Date Posted:</b> {jobData.date}</p> :  <span />}
          {jobData.salary ? <p className="text col-12"><b className="category">Salary:</b> {jobData.salary}</p> :  <span />}
          {jobData.experience ? <p className="text col-12"><b className="category">Minimum Experience:</b> {jobData.experience}</p> :  <span />}
          {jobData.jobType ? <p className="text col-12"><b className="category">Job Type:</b> {jobData.jobType}</p> : <span />}
          <br />
          {jobData.body ? <p className="text col-12"><b className="category">Details:</b><div className="text" dangerouslySetInnerHTML={this.createMarkup(jobData.body)}></div></p> : <span />}
        </ModalBody>
      </div>
    )
  }
}


