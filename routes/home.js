const express = require('express');
const router  = express.Router();

router.get('/', (req,res) => {
  res.render("index", {title: "My Node JS app", message: "Welcome to home page"})
})

module.exports = router;