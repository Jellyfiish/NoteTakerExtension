import React from "react";
import axios from "axios";
import Pin from "./Pin";
import Nav from "./Nav";
import List from "./List";
import AuthService from "./utils/AuthService";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleAuthenticate = this.handleAuthenticate.bind(this);
    this.fetch = this.fetch.bind(this);
    this.handleSignout = this.handleSignout.bind(this);

    this.auth = new AuthService(
      "7ahU6Olf4SuRFf3B3lDGVuY6DGP0hj5T",
      "dhsiao89.auth0.com",
      this.handleAuthenticate
    );
    
    this.state = {
      data: { urls: [] },
      loggedIn: this.auth.loggedIn()
    };
  }

//Check if logged in
  handleAuthenticate() {
    this.setState({
      loggedIn: this.auth.loggedIn()
    });
  }

//Get specific user
  fetch() {
    axios
      .get("/api/users/" + this.auth.getAccount().user_id)
      .then((res) => {
        if (res.data.length > 0) {
          this.setState({ data: res.data[0] });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

//Remove note from database
  deleteNote(name, uri, note) {
    axios({
        method: "delete",
        url: "/api/users/notes",
        data: { name: name, uri: uri, note: note }
      })
      .then((res) => {
        this.fetch();
      })
      .catch(error => {
        console.error(error);
      });
  }

//Remove entire url from database
  deleteList(name, uri) {
    axios({
        method: "delete",
        url: "/api/users/urls",
        data: { name: name, uri: uri }
      })
      .then((res) => {
        this.fetch();
      })
      .catch((error) => {
        console.error(error);
      });
  }

//Set sign out state
  handleSignout() {
    this.setState({
      loggedIn: false,
      data: { urls: [] }
    });
  }

  componentDidMount() {
    if (this.state.loggedIn) {
      this.fetch();
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.loggedIn && !this.state.loggedIn) {
      this.fetch();
    }
  }

  render() {
    return (
      <div>
        <Nav auth={this.auth} onSignout={this.handleSignout}/>
        <div className="container">
          {this.state.data.urls.map((list, index) => (
            <List
              name={this.state.data.name}
              data={list}
              key={index}
              deleteList={this.deleteList.bind(this)}
              deleteNote={this.deleteNote.bind(this)}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default App;
