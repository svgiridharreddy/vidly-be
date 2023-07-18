
const express = require('express');

// Middlewares
const logger = require("../middleware/logger");
const helmet = require("helmet");
const morgan = require('morgan');
const debug = require('debug')("app:startup")

require('express-async-errors'); // this is npm package that will work something like asyncMiddleWare by monkeyPatching. If this doen't work then uncomment the require statement of asyncMiddleWare and pass router handlers to asyncMiddleWare in genres api.

// Routes
const genres = require('../routes/genres');
const customers = require("../routes/customers");
const movies = require("../routes/movies");
const users = require("../routes/users");
const auth = require("../routes/auth");
const rentals = require("../routes/rentals");
const home = require("../routes/home");
const error = require("../middleware/error");

module.exports = function (app){
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));
  app.use(express.static("public"));
  app.use(helmet());
  app.use(logger);
  app.use("/api/genres", genres);
  app.use("/api/customers", customers);
  app.use("/api/movies",movies);
  app.use("/api/users",users);
  app.use("/api/auth",auth);
  app.use("/api/rentals",rentals);
  app.use("/",home);
  app.use(error);
  app.set("view engine","pug");

  if(app.get("env") === "development") {
    debug("in development mode")
    app.use(morgan('tiny'));
  }
}