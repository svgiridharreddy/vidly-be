const error = require("./middleware/error");
require('express-async-errors'); // this is npm package that will work something like asyncMiddleWare by monkeyPatching. If this doen't work then uncomment the require statement of asyncMiddleWare and pass router handlers to asyncMiddleWare in genres api.

const winston = require('winston');
require('winston-mongodb');
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

// Middlewares
const helmet = require("helmet");
const morgan = require('morgan');
const debug = require('debug')("app:startup")

// mongoose db
const mongoose = require('mongoose');

const logger = require("./middleware/logger");
const config = require('config');

// Routes
const genres = require('./routes/genres');
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const users = require("./routes/users");
const auth = require("./routes/auth");
const rentals = require("./routes/rentals");
const home = require("./routes/home");



const express = require('express');
const app = express();

process.on("uncaughtException",(ex) => {
  console.log(ex);
  winston.error(ex.message,ex)
})

winston.add(winston.transports.File, {filename: 'logFile.log'})
//in below code winston-mongodb package is used to log the error messages to db. It will create a new collection(log) in db with error messages.
// winston.add(winston.transports.mongoose,{db: 'mongodb://127.0.0.1:27017/vidly-be'})
//winston.add(winston.transports.mongoose,{db: 'mongodb://127.0.0.1:27017/vidly-be',level: 'error}) // refer documentation for more on setting log level and other options 





// load the environment variable at the time of application start. If no env variable is found app should not be run. This to make sure to send JWT Token in response.
console.log("private key is :",config.get("jwtPrivateKey")) // variable is not loading from environment variables. By passing using staic key loaded from development.json config file
if(!config.get("jwtPrivateKey")){
  console.error("Fatal Error: jwtPrivate key is not defined");
  process.exit(1);
} 

mongoose.connect("mongodb://127.0.0.1:27017/vidly-be")
.then(console.log("Connected to mongodb..."))
.catch((err) => console.error("mongodb not connected",err))

throw new Error("Cought exception")

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
app.set("view engine","pug");

app.use(error);


if(app.get("env") === "development") {
  debug("in development mode")
  app.use(morgan('tiny'));
}

// console.log(config.get("mail.host"));
// console.log(config.get("mail.password"));

app.listen(3000, () => console.log("Listening on port 3000..."))