// winstong - used  for logging 
const winston = require('winston');
// require('winston-mongodb');

require('express-async-errors'); // this is npm package that will work something like asyncMiddleWare by monkeyPatching. If this doen't work then uncomment the require statement of asyncMiddleWare and pass router handlers to asyncMiddleWare in genres api.

module.exports = function(){
  // Winston has a built in method that can handhle uncaughtExcepion . So below code is commented. 

  // process.on("uncaughtException",(ex) => {
  //   winston.error(ex.message,ex)
  // }) 

  //winston built in method to handle uncaughtException 
  // winston.handleExceptions(
  //   new winston.transports.Console({colorize: true, prettyPrint: true}),
  //   new winston.transports.File, {filename: 'uncaughtExceptions.log'}
  // )

  process.on("unhandledRejection",(ex) => {
  throw ex; // winston don't have helper method to handle promise rejections. So    simply unhandle the exception here, so winston will catch it in the above handleExceptions
  })

  winston.add(winston.transports.File, {filename: 'logFile.log'})
  //in below code winston-mongodb package is used to log the error messages to db. It will create a new collection(log) in db with error messages.
  // winston.add(winston.transports.mongoose,{db: 'mongodb://127.0.0.1:27017/vidly-be'})
  //winston.add(winston.transports.mongoose,{db: 'mongodb://127.0.0.1:27017/vidly-be',level: 'error}) // refer documentation for more on setting log level and other options 
}