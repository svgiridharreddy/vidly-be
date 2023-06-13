const auth = require('../middleware/authentication');
const express = require('express');
const router = express.Router();
const {Genre} = require('../models/genre');
const {Movie,validate} = require("../models/movie");

router.get("/", async(req,res) => {
  const movies = await Movie.find().sort('title')
  res.send(movies);
})

router.get("/:id", async(req,res) => {
  const movie = await Movie.findById(req.param.id)
  if(!movie) return res.status(404).send("Movie with given Id not found");
  res.send(movie);
})

router.post("/",auth,async(req,res) => {
  const {error} = validate(req.body)
  if(error) return res.status(400).send(error.details[0].message)
  const genre = await Genre.findById(req.body.genreId)
  if(!genre) return res.status(400).send("Invalid genre")
  const movie = await new Movie(
    {
      title: req.body.title,
      genre: {_id: genre._id,name: genre.name},
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    }
  )
  await movie.save()
  res.status(200).send(movie)
})

router.put("/:id", auth, async(req,res) => {
  const {error} = validate(req.body)
  if(error) return res.status(400).send(err)
  const genre = await Genre.findById(req.body.genreId)
  if(!genre) return res.send("Invalid Genre");
  const movie = await Movie.findByIdAndUpdate({_id: req.params.id},{
    $set: {
      title: req.body.title,
      genreId: genere._id
    }
  },{new: true})
  if(!movie) return res.status(404).send("Movie with given Id not found")
  res.status(200).send(movie)

})

router.delete("/:id", auth, async(req,res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id)
  if(!movie) return res.status(400).send("Movie with given Id not found")
  res.status(200).send({message: "Movie deleted successfully",movies})
})

module.exports = router;