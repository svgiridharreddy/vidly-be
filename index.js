
require('express-async-errors'); // this is npm package that will work something like asyncMiddleWare by monkeyPatching. If this doen't work then uncomment the require statement of asyncMiddleWare and pass router handlers to asyncMiddleWare in genres api.

const winston = require('winston');
require('winston-mongodb');
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);



// mongoose db
const mongoose = require('mongoose');


const config = require('config');

const express = require('express');
const app = express();
require("./startup/routes")(app)

// Winston has a built in method that can handhle uncaughtExcepion . So below code is commented. 

// process.on("uncaughtException",(ex) => {
//   winston.error(ex.message,ex)
// }) 

//winston built in method to handle uncaughtException 
winston.handleExceptions(winston.transports.File, {filename: 'uncaughtExceptions.log'})

process.on("unhandledRejection",(ex) => {
  throw ex; // winston don't have helper method to handle promise rejections. So simply unhandle the exception here, so winston will catch it in the above handleExceptions
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


if(app.get("env") === "development") {
  debug("in development mode")
  app.use(morgan('tiny'));
}

// console.log(config.get("mail.host"));
// console.log(config.get("mail.password"));

app.listen(3000, () => console.log("Listening on port 3000..."))