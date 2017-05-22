var User = require('../database/models/user.js');

//WEB APP ENDPOINTS//
//Handle User Get Request
exports.usersGet = (req, res) => {
  //send user_id in body
  User.find({user_id: req.params.id}, (err, user) => {
    if(err) {
      console.error(err);
    } else {
      res.status(201).send(user);
    }
  })
};

//Handle User Post Request
exports.userPost = (req, res) => {
  //send name/user_id in body
  User.find({user_id: req.body.user_id}, (err, user) => {
    if (err) {
      console.error(err);
    } else {
      if (user.length === 0) {
        addNewUser(req, (err, user) => {
          if(err) {
            res.status(404).send("Could not create user.");
          }

          if(user) {
            res.status(201).send("New User Created.");
          }
        });
      } else {
        res.status(201).send('User Already Exists.');
      }
    }
  })
};

function addNewUser(req, callback) {
  var account = new User({
    name: req.body.name,
    user_id: req.body.user_id
  });

  return account.save((err, account) => {
    if(err) {
      callback(err)

    } else {
      callback(null, true);
    }
  });
}
//Handle Remove Url
exports.urlRemove = (req, res) => {
  //send name/uri/note in body
  User.findOne({user_id: req.body.user_id}, (err, user) => {
    if(err) {
      console.log(err);
      res.status(404).send("Did not find User.");
    }
    var pages = user.urls.map((site) => site.name);
    var index = pages.indexOf(req.body.uri);

    if(index !== -1) {
     user.urls.splice(index, 1);
    }
    user.markModified('urls');
    user.save();
    res.status(201).send('Url Removed');
  });
}

//Handle Remove Note
exports.noteRemove = (req, res) => {
  //send name/url/note in body
  User.findOne({user_id: req.body.user_id}, (err, user) => {
    if(err) {
      console.log(err);
      res.status(404).send('Coud not remove note.');
    } else {
      var pages = user.urls.map((site) => site.name);
      var index = pages.indexOf(req.body.uri);

      if(index !== -1) {
        var noteIndex = user.urls[index].pins.findIndex(function(pin) {
          return pin.text === req.body.note;
        });
        if(noteIndex !== -1) {
          user.urls[index].pins.splice(noteIndex, 1);
        }
      }
      user.markModified('urls');
      user.save();
      res.status(201).send('Note Removed.');
    }
  });
}

//CHROME EXTENSION ENDPOINTS//
//Handle Add note to database for existing Users
exports.userAddNotes = function userAddNotes(req, res) {
  //send name/uri/note in body
  if(req.body.note === null || req.body.note === "") {
    res.status(404).send('Please hightlight something.');
  } else if (!req.body.user_id) {
    res.status(404).send('Please log in.');
  } else {
    User.findOne({user_id: req.body.user_id}, (err, user) => {
      if(err) {
        res.status(404).send('Could not find user.');
      }

      if(!user) {
        return addNewUser(req, () => {
          userAddNotes(req, res);
        });
      }

      var pages = user.urls.map(site => site.name);

      var pin = {
        text: req.body.note,
        color: req.body.color || 'yellow',
        annotation: req.body.annotation || ''
      };

      if(pages.includes(req.body.uri)) {
        user.urls[pages.indexOf(req.body.uri)].pins.push(pin);
      } else {
        user.urls.push({
          name: req.body.uri,
          pins: [pin],
        });
      }
      user.markModified('urls');
      user.save();
      res.status(201).send('Post Success');
    });
  }
};

// Handle adding an annotation to a note
exports.userAddAnnotations = function userAddAnnotations(req, res) {
  //send name/uri/note/annotation in body
  if (req.body.annotation === null || req.body.annotation === '') {
    res.status(404).send('Please add an annotation.');
  } else if (!req.body.user_id) {
    res.status(404).send('Please log in.');
  } else {
    User.findOne({user_id: req.body.user_id}, (err, user) => {
      if(err) {
        res.status(404).send('Could not find user.');
      }

      var pages = user.urls.map(site => site.name);

      if (pages.includes(req.body.uri)) {
        var pins = user.urls[pages.indexOf(req.body.uri)].pins;
        var note = pins.find(function(pin) {
          return pin.text === req.body.note;
        });

        if (!note) {
          res.status(404).send('Could not find note');
          return;
        }

        note.annotation = req.body.annotation;
        user.markModified('urls');
        user.save();
        res.status(201).send(req.body.annotation);
      } else {
        res.status(404).send('Could not find url');
      }
    });
  }
};

//Handle removing an annotation from a note
exports.annotationRemove = function annotationRemove(req, res) {
  //send name/uri/note in body
  User.findOne({user_id: req.body.user_id}, (err, user) => {
    if(err) {
      res.status(404).send('Could not find user.');
    }

    var pages = user.urls.map(site => site.name);

    if (pages.includes(req.body.uri)) {
      var pins = user.urls[pages.indexOf(req.body.uri)].pins;
      var note = pins.find(function(pin) {
        return pin.text === req.body.note;
      });

      if (!note) {
        res.status(404).send('Could not find note');
        return;
      }

      if (!note.annotation) {
        res.status(404).send('No annotation to remove');
        return;
      }

      var removedAnnotation = note.annotation;
      note.annotation = '';
      user.markModified('urls');
      user.save();
      res.status(201).send(removedAnnotation);
    } else {
      res.status(404).send('Could not find url');
    }
  });
};

// Handle changing color of a note
exports.noteColorChange = function noteColorChange(req, res) {
  //send name/uri/note/color in body
  if (!req.body.user_id) {
    res.status(404).send('Please log in.');
  } else {
    User.findOne({user_id: req.body.user_id}, (err, user) => {
      if (err) {
        res.status(404).send('Could not find user.');
      }

      var pages = user.urls.map(site => site.name);

      if (pages.includes(req.body.uri)) {
        var pins = user.urls[pages.indexOf(req.body.uri)].pins;
        var note = pins.find(function(pin) {
          return pin.text === req.body.note;
        });

        if (!note) {
          res.status(404).send('Could not find note');
          return;
        }

        note.color = req.body.color;
        user.markModified('urls');
        user.save();
        res.status(201).send(req.body.color);
      } else {
        res.status(404).send('Could not find url');
      }
    });
  }
};
