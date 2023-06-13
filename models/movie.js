const mongoose = require('mongoose');
const Joi = require('joi');
const {Genre,genreSchema,validate} = require("./genre");

const movieSchema = new mongoose.Schema({
  title: {type: String, required: true,min: 3,max: 255,trim: true},
  numberInStock: {type: Number,default: 0,min: 0,max: 255},
  dailyRentalRate: {type: Number,default: 0, min: 0,max: 255},
  genre: {type: genreSchema, required: true}
})

const Movie = mongoose.model("Movie",movieSchema)

function validateMovie(movie){
 console.log("Movie in validation",movie);
 const movieSchema = {
  title: Joi.string().min(3).required(),
  genreId: Joi.objectId().required(),
  numberInStock: Joi.number().min(0).required(),
  dailyRentalRate: Joi.number().min(0).required()
 }
 return Joi.validate(movie, movieSchema)
}

exports.Movie = Movie;
exports.validate = validateMovie;