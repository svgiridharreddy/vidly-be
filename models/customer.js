const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = new mongoose.Schema({
  name: {type: String, required: true, min: 3,max: 255},
  phone: {type: String, required: true, min: 10, max: 10},
  isGold: {type: Boolean,default: false}
})

const Customer = mongoose.model("Customer", customerSchema)

function validateCustomer(customer) {
  const schema = {
    name: Joi.string().min(3).max(255).required(),
    phone: Joi.string().min(10).max(10).required(),
    isGold: Joi.boolean().required()
  }
  return Joi.validate(customer, schema)
}

module.exports = {Customer,validate: validateCustomer}