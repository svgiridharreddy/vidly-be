// Joi - used for validations 
const Joi = require("joi");

module.exports = function(){
  Joi.objectId = require("joi-objectid")(Joi); // used to check mongodb object_id creation
}