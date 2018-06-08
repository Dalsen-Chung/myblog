const express = require('express')
const router = express.Router()
const checkLogin = require('../middlewares/check').checkLogin

//GET /signout user sign out
router.get('/', function (req, res, next) {
  res.send('user sign out')
})

module.exports = router
