import React, { Component } from 'react';
const client = require('../utils/client');


export default class Note extends Component {
  constructor(props) {
    super(props);

    this.state = {
      _editing: false,
    }
  }

  componentWillReceiveProps() {
    this.setState({
      _editing: false
    })
  }

  renderTextArea = () => {
    if (this.state._editing) {
      return(
        <div className="col-sm-12 text-center" >
          <textarea name="note" className="mb-2 w-75" rows="5" defaultValue={this.props.note} />
          <div className="mx-auto">
            <button className="btn btn-outline-secondary mx-1" type="submit" onClick={this.saveNote}>Save and Close</button>
            <button className="btn btn-outline-danger mx-1" onClick={this.deleteNote}>Delete Note</button>
            <button className="btn btn-outline-secondary mx-1" onClick={() => {
              this.setState({ _editing: false})
            }}>Close</button>
          </div>
        </div>
    )
    } else {
        return(<h3 className="col-sm-12 text-center p-5">{this.props.note}</h3>)
    }
  }

  saveNote = (e) => {
    e.preventDefault();
    var updatedNote = document.getElementsByName("note")[0].value;
    console.log(updatedNote);
    console.log(this.props._id);
    console.log(this.props.jobId);
    console.log(this.props.noteId);
    console.log(updatedNote);

    client.editNote(this.props._id, this.props.jobId, this.props.noteId, updatedNote, (response) => {
      var noteObject = {
        noteText: updatedNote,
        noteId: response.data
      };
      console.log(noteObject);
      this.props.handleClick(noteObject, "save");

      return this.setState({
        _editing: false,
      })
    })
  }

  deleteNote = (e) => {
    e.preventDefault();

    client.deleteNote(this.props._id, this.props.noteId, (response) => {
      this.props.handleClick(this.props.noteId, "delete");

      this.setState({
        _editing: false,
        note: ""
      })
    })
  }

  renderEditButton = () => {
    if (!this.state._editing) {
      return(
        <button className="btn btn-outline-secondary m-2" onClick={() => {
          this.setState({ _editing: true })
        }}>Edit Note</button>
      )
    }
  }

  render() {
    return (
      <div className="p-4">
        <form>
          {this.props.note ?

            <div className="row">
              <div className="col-sm-12 text-center">
                { this.renderEditButton() }
              </div>
              {this.renderTextArea(this.props)}
            </div>

            :

            <div className="row">
              <button className="btn btn-outline-secondary m-2 ml-auto mr-auto" onClick={() => {
                this.setState({ _editing: true })
              }}>Add a Note</button>
              {this.renderTextArea(this.props)}
            </div>
          }
        </form>
      </div>
    )
  }
}