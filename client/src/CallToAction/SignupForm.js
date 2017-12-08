import React, { Component } from 'react';
import client from '../utils/client';

export default class SignupForm extends Component {
  constructor() {
    super();

    this.state = {
      fields: {
        username: '',
        password: '',
        confirmPassword: '',
      },
      fieldErrors: {}
    }
  }

  onInputChange = (e) => {
    const fields = this.state.fields;
    fields[e.target.name] = e.target.value;

    if(e.target.name === "password" && e.target.value.length < 6) {
      return this.setState({
        fieldErrors: {
          pwdLength: "Your password must be at least 6 characters"
        }
      })
    } else {
      this.setState({
        fieldErrors: {}
      })
    }

    this.setState({ fields });
  }

  validate = () => {
    const field = this.state.fields;

    if (!field.username) return true;
    if (!field.password || field.password.length < 6) return true;
    if (!field.confirmPassword || field.confirmPassword.length < 6) return true;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if(this.state.fields.password !== this.state.fields.confirmPassword) {
      return this.setState({
        fieldErrors: {
          pwdMatch: "Your passwords do not match"
        }
      })
    }

    var userObject = {
      username: this.state.fields.username,
      password: this.state.fields.password
    }

    this.onSubmit(userObject);
  }

  onSubmit = (userObject) => {
    client.signup(userObject.username, userObject.password, (response) => {
      if (response.data === null) {
        return this.setState({
          fieldErrors: {
            exists: 'Username already exists'
          }
        })
    } else {this.props.onSignup(response.data) }
    })
  }

  render() {
    return(
      <div className="mr-2 signup">
        <div className="box mb-5">
          <h2>Let's get you geared up!</h2>
          <h4>Can't board the rocket without your spacesuit</h4>
        </div>
        <form onSubmit={this.handleSubmit} >

          <div className="row my-4">
            <div className="col-sm-8 mx-auto">
              <input placeholder="username" name="username" onChange={this.onInputChange} />
            </div>
          </div>

          <div className="row my-4">
            <div className="col-sm-8 mx-auto">
              <input placeholder="password" name="password" type="password" onChange={this.onInputChange} />
            </div>
          </div>

          <span className="live-error">{  this.state.fieldErrors.pwdLength }</span>

          <div className="row my-4">
            <div className="col-sm-8 mx-auto">
              <input placeholder="confirm password" name="confirmPassword" type="password" onChange={this.onInputChange} />
            </div>
          </div>

          <div className="row mt-5 mb-3">
            <div className="col-sm-7 mx-auto">
              <button type="submit" disabled={this.validate()}>Sign me up</button>
            </div>
          </div>

        </form>
        <h3 onClick={() => {this.props.onLoginClick("login")}}>Woops! I've been here before, take me back!</h3>
        {(this.state.fieldErrors.unauthorized) ?
          <span className="error">{ this.state.fieldErrors.unauthorized }</span>
        :
          <span></span>
        }
        {(this.state.fieldErrors.pwdMatch) ?
          <span className="error">{ this.state.fieldErrors.pwdMatch }</span>
        :
          <span></span>
        }
        {(this.state.fieldErrors.exists) ?
          <span className="error">{ this.state.fieldErrors.exists }</span>
        :
          <span></span>
        }
      </div>
    )
  }

}

/*
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
*/