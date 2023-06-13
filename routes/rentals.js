const auth = require("../middleware/authentication");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
// const Fawn = require('fawn');
// Fawn.init("mongodb://127.0.0.1:27017/vidly-be");

const { Rental,validate } = require("../models/rental");

const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");




router.get("/", async (req,res) => {
  const rentals = await Rental.find().sort("-dateOut")
  res.status(200).send(rentals)
})

router.post("/",auth, async (req,res) => {
  const {error} = validate(req.body)
  if(error) return res.status(400).send(error.details[0].message);
  console.log(req.body);
  const customer = await Customer.findById(req.body.customerId);
  if(!customer) return res.status(404).send("Invalid customer");
  const movie = await Movie.findById(req.body.movieId);
  if(!movie) return res.status(404).send("Invalid movie");
  if(movie.numberInStock === 0) return res.status(400).send("Movie not in stock");
  console.log("Movie in rentals",movie);
  let rental = await new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
      isGold: customer.isGold,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate 
    }
  })
  // implement 2phaseCommit or fix below fawn package error 

  // try {
  //   new Fawn.Task()
  //     .save("rentals", rental)
  //     .update("movies", {_id: movie._id},{
  //       $set: {
  //         $inc: {numberInStock: -1}
  //       }
  //     })
  //   res.status(200).send(rental)
  // } catch (error) {
  //   res.status(500).send(error)
  // }

  rental.save();
  movie.numberInStock--;
  movie.save()
  res.status(200).send(rental) 

})

module.exports = router;