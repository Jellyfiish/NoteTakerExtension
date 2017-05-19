import React from "react";

class Nav extends React.Component {
  constructor(props) {
    super(props);

    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogin() {
    this.props.auth.login();
  }

  handleLogout() {
    this.props.auth.logout();
    this.props.onSignout();
  }

  render() {
    var loggedIn = this.props.auth.loggedIn();
    var authButton;

  //Conditional to render correct button if logged in or not
    if (!loggedIn) {
      authButton = <a onClick={this.handleLogin}>Login</a>;
    } else {
      authButton = <a onClick={this.handleLogout}>Logout</a>
    }

    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <a className="navbar-brand penguin">
              <img className="penguin" src="./yummypanguin.png"></img>
            </a>
            <button
              type="button"
              className="navbar-toggle collapsed"
              data-toggle="collapse"
              data-target="#bs-example-navbar-collapse-1"
            >
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar" />
              <span className="icon-bar" />
              <span className="icon-bar" />
            </button>
            <a className="navbar-brand" href="#">Noted</a>
          </div>
          <div
            className="collapse navbar-collapse"
            id="bs-example-navbar-collapse-1"
          >
            <ul className="nav navbar-nav">
              <li>{authButton}</li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default Nav;
