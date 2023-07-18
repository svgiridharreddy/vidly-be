
const express = require('express');

// Middlewares
const logger = require("../middleware/logger");
const helmet = require("helmet");
const morgan = require('morgan');
const debug = require('debug')("app:startup")

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
}