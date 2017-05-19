import React from "react";
import axios from "axios";
import Pin from "./Pin";
import Nav from "./Nav";
import List from "./List";
import AuthService from "./utils/AuthService";
import { AUTH0_CLIENT_ID, AUTH0_DOMAIN } from '../config/config';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleAuthenticate = this.handleAuthenticate.bind(this);
    this.fetch = this.fetch.bind(this);
    this.handleSignout = this.handleSignout.bind(this);
    this.handleFilter = this.handleFilter.bind(this);

    this.auth = new AuthService(
      AUTH0_CLIENT_ID,
      AUTH0_DOMAIN,
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
  deleteNote(userId, uri, note) {
    axios({
        method: "delete",
        url: "/api/users/notes",
        data: { user_id: userId, uri: uri, note: note }
      })
      .then((res) => {
        this.fetch();
      })
      .catch(error => {
        console.error(error);
      });
  }

//Remove entire url from database
  deleteList(userId, uri) {
    axios({
        method: "delete",
        url: "/api/users/urls",
        data: { user_id: userId, uri: uri }
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

  handleFilter(searchString) {
    // split on ' site:'
    let searchArray = searchString.split('site:');
    // if site in searchString, trim
    let site = searchArray[1] || null;
    if (site) site = site.trim();
    let searchTerm = searchArray[0] || null;
    if (searchTerm) searchTerm = searchTerm.trim();

  }

//   { searchTerm: 'search', site: ' mysite' }
// > var parse = function(searchString) {
// ... let temp = searchString.split(' site:');
// ... let site = temp[1] || null;
// ... if (site) site = site.trim();
// ... let searchTerm = temp[0] || null;
// ... return {searchTerm: searchTerm, site: site};
// ... }

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
        <Nav auth={this.auth} onSignout={this.handleSignout} onFilter={this.handleFilter}/>
        <div className="container">
          {this.state.data.urls.map((list, index) => (
            <List
              name={this.state.data.name}
              userId={this.state.data.user_id}
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
