import React, { Component } from 'react';
import client from '../utils/client';


export default class LoginForm extends Component {
  constructor() {
    super();

    this.state = {
      fields: {
        username: '',
        password: ''
      },
      fieldErrors: {}
    }
  }

  onInputChange = (e) => {
    const fields = this.state.fields;
    fields[e.target.name] = e.target.value;

    this.setState({ fields });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    var userObject = {
      username: this.state.fields.username,
      password: this.state.fields.password
    }

    this.onSubmit(userObject);
  }

  validate = () => {
    const field = this.state.fields;

    if (!field.username) return true;
    if (!field.password || field.password.length < 6) return true;
  }

  onSubmit = (userObject) => {
    client.login(userObject.username, userObject.password, (response) => {
      this.props.onLogin(response.data);
    }, (err) => {
      if(err === 401) {
        this.setState({
          fieldErrors: {
            unauthorized: "Incorrect username or password"
          }
        })
      }
    })
  }


  render() {
    return(
      <div className="login">
        <div className="box mb-5">
          <h2>Prepare for liftoff!</h2>
          <h4>Because an adventure never begins without a rocketship</h4>
        </div>
        <form onSubmit={this.handleSubmit}>

          <div className="row my-3">
            <div className="col-sm-8 mx-auto">
              <input placeholder="username" name="username" onChange={this.onInputChange} />
            </div>
          </div>

          <div className="row my-3">
            <div className="col-sm-8 mx-auto">
              <input placeholder="password" name="password" type="password" onChange={this.onInputChange}/>
            </div>
          </div>

          <div className="row mt-5 mb-3">
            <div className="col-sm-7 mx-auto">
              <button type="submit" disabled={this.validate()}>Launch</button>
            </div>
          </div>

        </form>
        <h3 onClick={() => {this.props.onSignupClick("signup")}}>Not a member? Join us here!</h3>
        {(this.state.fieldErrors.unauthorized) ?
          <span className="error">{ this.state.fieldErrors.unauthorized }</span>
        :
          <span></span>
        }
      </div>
    )
  }
}