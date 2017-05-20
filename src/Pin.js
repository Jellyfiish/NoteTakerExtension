import React from 'react';

class Pin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
        <li className="list-group-item">
          <div className="pin">
            {this.props.note.text}
          </div>
          <button className="btn btn-warning " onClick={() => this.props.deleteNote(this.props.userId, this.props.listname, this.props.note.text)} >
            <span className="glyphicon glyphicon-trash"></span>
          </button>
        <p className="pin-url"></p>
      </li>
    )
  }
}

export default Pin;
