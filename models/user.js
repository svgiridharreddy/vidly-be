const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require("mongoose");
const Joi = require('joi');


const userSchema = new mongoose.Schema({
  name: {type: String, minLength: 3, maxLength: 50, trim: true, required: true},
  email: {type: String, trim: true, required: true, unique: true, minLength: 3, maxLength: 255},
  password: {type: String, required: true, minLength: 5, maxLength: 1024 },
  isAdmin: Boolean
})

userSchema.methods.generateAuthToken = function(){
  const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
  return token;
}

const User = mongoose.model("User", userSchema);

function validateUser(user){
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  }
  return Joi.validate(user, schema);
}


module.exports = {User, validate: validateUser};