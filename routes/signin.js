const express = require('express')
const router = express.Router()
const checkNotLogin = require('../middlewares/check').checkNotLogin

//  GET /signin page of signin
router.get('/', checkNotLogin, function (req, res, next) {
  res.render('pages/login')
})

//  POST  /signin user signin
router.post('/', checkNotLogin, function (req,res,next) {
  res.send('user signin')
})

module.exports = router
