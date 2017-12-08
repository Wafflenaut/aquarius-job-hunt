import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import React, { Component } from 'react';
import { Button } from 'reactstrap';
import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';

const Handle = Slider.Handle;

export default class JobPrioritySettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      locationValue: parseInt(this.props.priorityList[0], 10),
      titleValue: parseInt(this.props.priorityList[1], 10),
      keywordValue: parseInt(this.props.priorityList[2], 10)
    }
  }

  handle = (props) => {
    const { value, dragging, index, ...restProps } = props;
    return (
      <Tooltip
        prefixCls="rc-slider-tooltip"
        overlay={value}
        visible={dragging}
        placement="top"
        key={index}
      >
        <Handle value={value} {...restProps} />
      </Tooltip>
    );
  };

  locationChange = (value) => {
    this.setState({
      locationValue: value
    })
  }

  titleChange = (value) => {
    this.setState({
      titleValue: value
    })
  }

  keywordChange = (value) => {
    this.setState({
      keywordValue: value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.onSubmit([this.state.locationValue, this.state.titleValue, this.state.keywordValue])
  }

  render() {
    return(
      <div className="row no-gutters default-border m-3 p-3">
        <div className="col-sm-12 font-italic instructions text-center mt-3 mb-3">
          &lt;-- Least Important -- Most Important --&gt;
        </div>
        <form className="col-sm-12">
          <div className="col-sm-8 offset-sm-2 mt-3 mb-3">
            Job Location
            <div className="slider" name="location">
              <Slider
                min={1}
                max={5}
                defaultValue={this.state.locationValue}
                handle={this.handle}
                onChange={this.locationChange}
              />
            </div>
          </div>
          <div className="col-sm-8 offset-sm-2 mt-3 mb-3">
            Job Title
            <div className="slider" name="title">
              <Slider
                min={1}
                max={5}
                defaultValue={this.state.titleValue}
                handle={this.handle}
                onChange={this.titleChange}
              />
            </div>
          </div>
          <div className="col-sm-8 offset-sm-2 mt-3 mb-5">
            Keywords
            <div className="slider" name="keywords">
              <Slider
                min={1}
                max={5}
                defaultValue={this.state.keywordValue}
                handle={this.handle}
                onChange={this.keywordChange}
              />
            </div>
          </div>
          <Button className="btn btn-outline-secondary" type="submit" onClick={this.handleSubmit}>Update</Button>
        </form>
      </div>
    )
  }
}