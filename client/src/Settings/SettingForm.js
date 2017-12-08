import React, { Component } from 'react';
const helpers = require('../utils/helpers');
const classNames = require('classnames');


export default class SettingForm extends Component {
  constructor () {
    super();

    this.state = {
      fields: {
        preference: "",
        strength: null
      },
      fieldErrors: {}
    }
  }

  componentWillReceiveProps() {
    var fields = this.state.fields;
    fields.preference = ''
    this.setState({
      fields,
      fieldErrors: {}
    })
  }

  onInputChange = (e) => {
    const fields = this.state.fields;
    fields[e.target.name] = e.target.value;

    this.setState({ fields });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    var listObject = {
      preference: this.state.fields.preference,
      strength: this.state.fields.strength,
      type: helpers.trimTrailingS(this.props.type)
    }

    var fieldErrors = this.validateField(listObject, this.props.name);

    this.setState({ fieldErrors });

    if (Object.keys(fieldErrors).length) return;

    this.props.onSubmit(listObject);

    this.setState({
        fields: {
          preference: ""
        }
    })
  }

  validate = () => {
    const field = this.state.fields;

    if (!field.preference) return true;
    if (!field.strength) return true;
  }

  validateField = (formField, formName) => {
    const errors = {}

    var preferenceExists;
    preferenceExists = this.compareToList(formField, this.props.list);
    if(preferenceExists) errors.exists = 'Value already exists';

    if (formName === 'Location') {
      var locationExists = this.validateLocationFormat(formField.preference);
      if (!locationExists) errors.location = 'Please use the following format: City, State'
    }

    return errors;
  }

  compareToList = (newListObject, listArray) => {
    var preferenceExists = false;

    listArray.forEach((listObject) => {
      if(listObject.preference === newListObject.preference) {
        preferenceExists = true;
        return;
      }
    })

    return preferenceExists;
  }

  validateLocationFormat(location) {
    var re = /^[A-Za-z]+,[ ]?[A-Za-z]{2,}$/;
    return re.test(location);
  }

  getStrengthRating() {
    if (this.props.name === "Job Title") {
      return(
        <div>
          <span className="d-inline-block">
            <input type="radio" name="strength" value={3} />
            <i className="em em-grinning ml-2 mr-3" />
          </span>

          <span className="d-inline-block">
            <input type="radio" name="strength" value={2} />
            <i className="em em-blush ml-2 mr-3" />
          </span>

          <span className="d-inline-block">
            <input type="radio" name="strength" value={1} />
            <i className="em em-slightly_smiling_face ml-2 mr-3"></i>
          </span>

          <span className="d-inline-block">
            <input type="radio" name="strength" value={0} />
            <i className="em em-neutral_face ml-2 mr-3" />
          </span>

          <span className="d-inline-block">
            <input type="radio" name="strength" value={-1} />
            <i className="em em-slightly_frowning_face ml-2 mr-3"></i>
          </span>
        </div>
      )
    } else if (this.props.name === "Location") {
      return(
        <div>
          <span className="d-inline-block">
            <input type="radio" name="strength" value={3} />
            <i className="em em-grinning ml-2 mr-3" />
          </span>

          <span className="d-inline-block">
            <input type="radio" name="strength" value={2} />
            <i className="em em-blush ml-2 mr-3" />
          </span>

          <span className="d-inline-block">
            <input type="radio" name="strength" value={1} />
            <i className="em em-slightly_smiling_face ml-2 mr-3"></i>
          </span>

          <span className="d-inline-block">
            <input type="radio" name="strength" value={0} />
            <i className="em em-neutral_face ml-2 mr-3" />
          </span>
        </div>
      )
    } else if (this.props.name ==="Keywords") {
      return(
        <div>
          <span className="d-inline-block">
            <input type="radio" name="strength" value={3} />
            <i className="em em-grinning ml-2 mr-3" />
          </span>

          <span className="d-inline-block">
            <input type="radio" name="strength" value={2} />
            <i className="em em-blush ml-2 mr-3" />
          </span>

          <span className="d-inline-block">
            <input type="radio" name="strength" value={1} />
            <i className="em em-slightly_smiling_face ml-2 mr-3"></i>
          </span>

          <span className="d-inline-block">
            <input type="radio" name="strength" value={-1} />
            <i className="em em-slightly_frowning_face ml-2 mr-3"></i>
          </span>
        </div>
      )
    }
  }

  render() {
    var name = helpers.trimTrailingS(this.props.name);

    const errorClass = classNames({
      "bg-danger": true,
      "text-white": true,
      "p-2 mt-2 mb-2": (Object.keys(this.state.fieldErrors).length)
    })

    return(
      <div className="setting-form text-center">
        <form className="mb-3 row justify-content-center" onSubmit={this.handleSubmit}>
          <label className="col-12 mt-2 mb-3"><h5>Add a {name}</h5></label>

          <fieldset className="col-12 mb-5">
            <input
              className="text-center w-75"
              name="preference"
              placeholder={name}
              value={this.state.fields.preference}
              onChange={this.onInputChange}
            />
          </fieldset>

          <fieldset className="col-12 mb-5" onChange={this.onInputChange}>
            <label className="mb-2 col-12"><h5>Strength Rating</h5></label>
            {this.getStrengthRating()}
          </fieldset>

          <button className="btn btn-outline-secondary" type="submit" disabled={this.validate()}>
            Add to List
          </button>
        </form>
        <div className="row no-gutters justify-content-center">
           {this.state.fieldErrors.empty ? (
            <span className={errorClass}>{ this.state.fieldErrors.empty }</span>
           ) : ''}
           {this.state.fieldErrors.exists ? (
            <span className={errorClass}>{ this.state.fieldErrors.exists }</span>
           ) : ''}
           {this.state.fieldErrors.location ? (
            <span className={errorClass}>{ this.state.fieldErrors.location }</span>

           ) : ''}
           {this.state.fieldErrors.strength ? (
            <span className={errorClass}>{ this.state.fieldErrors.strength }</span>

           ) : ''}
        </div>
      </div>
    )
  }
}