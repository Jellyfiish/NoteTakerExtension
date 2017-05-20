import Auth0Lock from "auth0-lock";
import { browserHistory } from "react-router";
import axios from "axios";

export default class AuthService {
  constructor(clientId, domain, authenticateCallback) {
    // Configure Auth0
    this.authenticateCallback = authenticateCallback;
    this.lock = new Auth0Lock(clientId, domain, {
      auth: {
        redirectUrl: "https://jellyfiish-noted.herokuapp.com/",
        responseType: "token"
      }
    });
    // Add callback for lock `authenticated` event
    this.lock.on("authenticated", this._doAuthentication.bind(this));
    // binds login functions to keep this context
    this.login = this.login.bind(this);
    this.createNewUser = this.createNewUser.bind(this);
  }

  _doAuthentication(authResult) {
    var account = {};

    // Saves the user token
    this.lock.getUserInfo(authResult.accessToken, (error, profile) => {
      account.name = profile.email;
      account.user_id = profile.user_id;
      this.setAccount(account);
      this.createNewUser(account);
    });
    this.setToken(authResult.idToken);
  }

  createNewUser(account) {
    axios
      .post("/api/users/", account)
      .then((res) => {
        this.authenticateCallback();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  login() {
    // Call the show method to display the widget.
    this.lock.show();
  }

  loggedIn() {
    // Checks if there is a saved token and it's still valid
    var token = localStorage.getItem("id_token");
    return !!token;
  }

  getAccount() {
    return JSON.parse(localStorage.getItem('account'));
  }

  setAccount(account) {
    localStorage.setItem('account', JSON.stringify(account));
  }

  setToken(idToken) {
    // Saves user token to local storage
    localStorage.setItem("id_token", idToken);
  }

  logout() {
    // Clear user token and profile data from local storage
    localStorage.removeItem("id_token");
    localStorage.removeItem('account');
  }
}
