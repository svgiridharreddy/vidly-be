const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = new mongoose.Schema({
  name: {type: String,required: true, minLength: 5,maxLength: 50}
})

const Genre = mongoose.model("Genre", genreSchema)


function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(5).max(50).required()
  }
  return Joi.validate(genre, schema)
}

module.exports = {Genre,genreSchema, validate: validateGenre}