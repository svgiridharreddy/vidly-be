// const asyncMiddleWare = require('../middleware/async');
const auth = require('../middleware/authentication');
const admin = require("../middleware/admin");
const express = require('express');
const router = express.Router();
const {Genre, validate} = require('../models/genre');

router.get("/",async (req,res) => {
  throw new Error("Something went wrong");
    const genres = await Genre.find().sort('name');
    res.send({genres, message: "success", status: 200});
  }
)

router.get("/:id", async(req,res) => {
  const genre = await Genre.findById(req.params.id);
  if(!genre) return res.status(404).send("Genre with given ID is not found");
  res.send({genre, message: "success", status: 200});
})

router.post("/",auth, async (req,res) => {
  const {error} = validate(req.body)
  if(error) {
    res.status(400).send(error.details[0].message);
  }
  const genre = await new Genre( {
    name: req.body.name
  })
  await genre.save();
  res.status(200).send({genre, message: "created successfully", status: 200});
})

router.put("/:id",auth, async (req, res) => {
  const { error } = validate(req.body)
  if(error) return res.status(400).send(error.details[0].message);
  const genre = await Genre.findById(req.params.id);
  if(!genre) return res.status(404).send("Genre with given ID is not found");
  genre.name = req.body.name;
  res.status(200).send({genre, message: "updated successfully",status: 200});
})

router.delete("/:id",[auth,admin], async (req,res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if(!genre) return res.status(404).send("Genre with given ID is not found")
  res.send({genre, message: "Deleted successfully", status: 200});
})

module.exports = router;