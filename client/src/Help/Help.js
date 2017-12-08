import React, { Component } from 'react';


export default class Help extends Component {
  render() {
    return(
      <div className="help ml-sm-5 dashboard-item border">
        <div className="help-text">
        <h2>How to use this App</h2>
            <ul>
              <li>Add Location, Job Title, and Keyword preferences on the Job Hunt Settings Tab</li>
              <li>Change your priority for each type of preference from the Priority tab of the Job Hunt Settings interface</li>
              <li>View jobs in your queue and choose to apply, save for later, or ignore the jobs</li>
              <li>Review jobs you’ve applied to or saved in your Job Hunt Review interface and add your important notes about the job</li>
            </ul>
          <br />
        <h2>FAQ</h2>
          <ol>
            <li>Who do I contact with questions?</li>
            <p>see section - contact-info</p>
            <br />
            <li>Who is this app for</li>
            <p>Anyone who is actively looking for a job, and wants to view a list of jobs based on a graded on a criteria</p>
          </ol>
        <h2>Contact Info</h2>
          <ul>
            <li>Miles Bright - brightmi@oregonstate.edu</li>
            <li>James Gill - gilljam@oregonstate.edu</li>
            <li>John Moyer - moyerjo@gmail.com</li>
          </ul>
        </div>
      </div>
    )
  }
}