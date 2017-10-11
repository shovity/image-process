const express = require('express')

const index = express.Router()

index.get('/', (req, res, next) => {
  res.render('home', { title: "Home" })
})

module.exports = index;
