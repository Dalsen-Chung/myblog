const express = require('express')
const router = express.Router()
const checkNotLogin = require('../middlewares/check').checkNotLogin

//  GET / page of signup
router.get('/', checkNotLogin, function (req, res, next) {
  res.send('page of signup')
})

//  POST  / user signup
router.post('/', checkNotLogin, function (req, res, next) {
  res.send('user signup')
})

module.exports = router
