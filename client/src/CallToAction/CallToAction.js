import React, { Component } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
const LOGIN = "login";
//const SIGNUP = "signup";


export default class CallToAction extends Component {
  constructor() {
    super();

    this.state = {
      activeForm: LOGIN
    }
  }

  setActiveForm = (formType) => {
    this.setState({
      activeForm: formType
    })
  }

  render() {
    return(
      <div className="landing-page">
        <div className="row">
          <div className="hero-box col-sm-9">
            <div className="hero-text-box">
              <h1>Simple Made Simpler</h1>
              <h4>Your career.< br/> Your life.< br/>Aquarius.</h4>
            </div>
          </div>
          <div className="col-sm-3 text-center login-signup">
            {
              (this.state.activeForm === LOGIN) ?
              <LoginForm onSignupClick={this.setActiveForm} onLogin={this.props.onLogin} />
            :
              <SignupForm onLoginClick={this.setActiveForm} onSignup={this.props.onLogin}/>
            }
          </div>
        </div>
      </div>
    )
  }
}