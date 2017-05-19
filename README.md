# Noted Web App #

## Summary ##

In today's society, it is virtually impossible to avoid using the internet, whether for work, entertainment, or communication. That being said, every web site is different, and it is often very difficult to keep track of what matters accross multiple pages. Noted aims to simplify the process by allowing the user to highlight portions of web pages and save them to their account as they surf the web. Notes will be kept nice and tidy in the Noted web app for the next time they're needed.

## How to Get Started ##

### Users ###

1. Install the [Noted Chrome extension](https://chrome.google.com/webstore/detail/noted/lfhnbpecbkhfahjfgllalgjjalediolj/related).
1. Open [Noted](https://noteextension.herokuapp.com/) in your browser, or use the Manage Account button in the Noted extension.
1. Click the Login button in the top left corner and sign in with your preferred credentials.

### Developers ###

1. Clone the repo
1. Run the `npm install` command from inside the `NoteTakerExtension/` directory to install the necessary dependencies.
1. Install the Noted chrome extension either from the [Chrome Web Store](https://chrome.google.com/webstore/detail/noted/lfhnbpecbkhfahjfgllalgjjalediolj/related) or from [source](https://github.com/Jellyfiish/Chrome-NoteTakerExtension).
1. Login to your [Auth0](https://auth0.com/) account.
  1. Create a new Client from the Clients menu (select the Single Page Web Applications client type when prompted).
  1. Add the following URL to the list of Allowed Callback URLs: `https://<noted-extension-id>.chromiumapp.org/auth0`
    **Note: your extension id can be found in the Settings -> Extensions menu in your Chrome browser.**
  1. Add the following line to the list of Allow Origins (CORS): `chrome-extension://<noted-extension-id>/*`
1. Make a new `config.js` file in the `NoteTakerExtension/config/` directory.
  1. Replace the `AUTH0_CLIENT_ID` and `AUTH0_DOMAIN` values with those you received in the above step.
1. Make sure your [MongoDB](https://www.mongodb.com/download-center#community) database server is running and listening on port 27017.
1. Run the `npm run bundle` command from inside the `NoteTakerExtension/` directory to bundle the source files.
1. Run `npm start` or `npm run start:watch` to start the server.
1. Navigate to [http://localhost:3003](http://localhost:3003/) in your browser.
1. Click the Login button in the top left corner and sign in with your preferred credentials.

## Usage ##

1. Click any URL to open that page in a new tab.
1. Use the trash can icons on the right to delete individual notes or entire web pages from your account.

## Contributing ##

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

### Roadmap ###

View the roadmap and submit new issues [here](https://github.com/Jellyfiish/NoteTakerExtension/issues).

