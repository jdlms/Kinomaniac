require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const favicon = require("serve-favicon");
const session = require("express-session");
const { MONGO_URI } = require("../db");
const MongoDBStore = require("connect-mongodb-session")(session);
const passport = require("passport");
const User = require("../models/User.model");
const path = require("path");
const { handlebars } = require("hbs");

//DBStore
const store = new MongoDBStore({
  uri: MONGO_URI,
  collection: "sessions",
});
// Middleware configuration
module.exports = (app) => {
  // In development environment the app logs
  app.use(logger("dev"));

  // To have access to `body` property in the request
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  //Get the GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET from Google Developer Console
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

  const GoogleStrategy = require("passport-google-oauth20").Strategy;
  console.log(process.env.GOOGLE_CALLBACK_URL);

  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        passReqToCallback: true,
      },
      function (req, accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
          const googleUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            picture: profile.photos[0].value,
          };
          return cb(err, googleUser);
        });
      }
    )
  );

  passport.serializeUser(function (user, done) {
    // console.log("A", user);
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    // console.log("B", user);
    done(null, user);
  });

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      },
      store: store,
      resave: true,
      saveUninitialized: true,
    })
  );

  app.use(passport.initialize()); // init passport on every route call
  app.use(passport.session()); //allow passport to use "express-session"

  // Normalizes the path to the views folder
  app.set("views", path.join(__dirname, "..", "views"));
  // Sets the view engine to handlebars
  app.set("view engine", "hbs");

  // handlebars.registerPartial("filmtitles", "{{filmtitles}}");

  //icon helpers
  handlebars.registerHelper("isWatched", (movies, id) => {
    if (!movies) return "";
    return movies[id]?.watchList ? "watched" : "";
  });
  handlebars.registerHelper("isStarred", (movies, id) => {
    if (!movies) return "";
    return movies[id]?.liked ? "starred" : "";
  });

  // Handles access to the public folder
  app.use(express.static(path.join(__dirname, "..", "public")));

  // Handles access to the favicon
  app.use(favicon(path.join(__dirname, "..", "public", "images", "favicon.ico")));

  app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
  });
};
