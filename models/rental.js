const mongoose = require('mongoose');
const Joi = require("joi");
const rentalSchema = new mongoose.Schema(
  {
    customer: {
      type: new mongoose.Schema({
        name: {type: String, min: 3, max: 50, required: true,trim: true},
        phone: {type: String, min: 10, max: 10,required: true,trim: true},
        isGold: {type: Boolean,required: true, default: false}
      }),
      required: true,
    },
    movie: {
        type: new mongoose.Schema({
        title: {type: String, min: 3, max: 255, required: true,trim: true},
        dailyRentalRate: {type: Number, min: 0, max: 255, required: true}
      }), 
      required: true
    },
    dateOut: {
      type: Date,
      required: true,
      default: Date.now()
    },
    dateReturned: {
      type: Date,
    },
    rental: {
      type: Number,
      min: 0
    }
  }
)

const Rental = mongoose.model("Rental", rentalSchema)

function validateRental(rental){
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  }
  return Joi.validate(rental,schema);
}

module.exports = {Rental, validate: validateRental}