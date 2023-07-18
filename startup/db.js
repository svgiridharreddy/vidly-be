// logging 
const winston = require('winston');

// mongoose db
const mongoose = require('mongoose');

module.exports = function(){
  mongoose.connect("mongodb://127.0.0.1:27017/vidly-be")
  .then(() =>  winston.info("Connected to mongodb..."))
}