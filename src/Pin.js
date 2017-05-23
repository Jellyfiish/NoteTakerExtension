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
            <div className="note-text-container">
              <span className="note-text">{this.props.note.text.length > 100 ? this.props.note.text.slice(0,100) + '...' : this.props.note.text}</span>
              <button className="btn btn-warning " onClick={() => this.props.deleteNote(this.props.userId, this.props.listname, this.props.note.text)} >
                <span className="glyphicon glyphicon-trash"></span>
              </button>
            </div>
            {(this.props.note.annotation &&
                          <div className="note-annotation-container">
                            <span className="note-annotation">{this.props.note.annotation}</span>
                            <button className="btn btn-info " onClick={() => this.props.deleteAnnotation(this.props.userId, this.props.listname, this.props.note.text)} >
                              <span className="glyphicon glyphicon-trash"></span>
                            </button>
                          </div>) ||
            <div>
              <div className="annotation-input-container">
                <input
                  className="form-control annotation-input"
                  type="text"
                  placeholder="Enter your annotation..."
                  ref={(input) => { this.textInput = input; }}
                />
              </div>
              <button className="btn add-annotation-btn" onClick={() => this.props.addAnnotation(this.props.userId, this.props.listname, this.props.note.text, this.textInput.value)} >Add Annotation</button>
            </div>
            }
          </div>
        <p className="pin-url"></p>
      </li>
    )
  }
}

export default Pin;
