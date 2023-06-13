const auth = require("../middleware/authentication");
const express = require("express");
const { Customer, validate } = require("../models/customer");
const router = express.Router();
const Joi = require("joi");

router.get("/", async (req,res) => {
  const customers = await Customer.find().sort('name');
  res.status(200).send(customers)
})

router.get("/:id", async(req,res) => {
  const customer = await Customer.findById(req.params.id);
  if(!customer) return req.status(404).send("Customer with given Id not found");
  res.status(200).send(customer);
})

router.post("/",auth, async(req,res) => {
  const {error} = validate(req.body)
  if(error) return res.status(400).send(error);
  const customer = await new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold
  })
  customer.save();
  res.status(200).send(customer)
})

router.put("/:id", auth, async(req,res) => {
  const {error} = validate(req.body);
  if(error) return res.status(400).send(error);
  const customer = await Customer.findByIdAndUpdate({
    _id: req.params.id
  }, {
    $set:  {
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold
    }
  })
  customer.save();
  res.status(200).send(customer)
})

router.delete("/:id", auth, async(req,res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  if(!customer) return res.status(404).send("Customer with given Id not found");
  res.status(200).send({message: "Customer deleted successfully", customer})
})

module.exports = router;