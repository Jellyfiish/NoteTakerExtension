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
      data: {
        urls: [],
      },
      filteredUrls: [],
      filtered: false,
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

  parseFilter(searchString) {
    // split on ' site:'
    let hasSite = searchString.indexOf('site:');
    let hasColor = searchString.indexOf('color:');
    let searchArray = searchString.split(/site\:|color\:/);
    let searchTerm = searchArray[0].trim() ? searchArray[0].trim() : null;
    let site = null;
    let color = null;
    console.log(searchArray);
    if (hasSite >= 0 && hasColor >= 0) {
      if (hasSite < hasColor) {
        site = searchArray[1];
        color = searchArray[2];
      } else {
        color = searchArray[1];
        site = searchArray[2];
      }
    } else if (hasSite >= 0) {
      site = searchArray[1];
    } else if (hasColor >= 0) {
      color = searchArray[1];
    }

    if (site) site = site.trim().length ? site.trim() : null;
    if (color) color = color.trim().length ? color.trim() : null;

    return {searchTerm, site, color};
  }

  handleFilter(searchString) {
    // only rerender if the string is empty and we haven't already set filtered to false
    if (searchString) {
      let {searchTerm, site, color} = this.parseFilter(searchString);
      // Array.slice() does not copy nested arrays, therefore:
      let urls = JSON.parse(JSON.stringify(this.state.data.urls.slice()));
      // filter out sites if the "site:" selector is used
      if (site) {
        urls = urls.filter(url => url.name.includes(site));
      }
      // if no search term is given but there is a site, it will just show everything from that site
      if (searchTerm || color) {
        urls = urls.filter(url => {
          url.pins = url.pins.filter(pin => {
            // really wish I didn't have to parse each pin everytime this is run, move into backend code?
            let pinObj = JSON.parse(pin);
            // could either use pinObj.color.includes(color) or do pinObj.color === color. I think there are benefits to either approach.
            let colorCheck = color ? pinObj.color.includes(color) : true;
            let noteCheck = searchTerm ? pinObj.note.includes(searchTerm) : true;
            return colorCheck && noteCheck;
          });
          return url.pins.length > 0;
        });
      }

      this.setState({filtered: true, filteredUrls: urls});
    } else if (this.state.filtered) {
      this.setState({filtered: false, filteredUrls: []});
    }
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
    let urls = this.state.filtered ? this.state.filteredUrls : this.state.data.urls;
    console.log(this.state.filtered, urls);

    return (
      <div>
        <Nav auth={this.auth} onSignout={this.handleSignout} onFilter={this.handleFilter}/>
        <div className="container">
          {urls.map((list, index) => (
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
