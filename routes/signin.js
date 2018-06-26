const express = require('express')
const router = express.Router()
const checkNotLogin = require('../middlewares/check').checkNotLogin

//  GET /signin page of signin
router.get('/', checkNotLogin, function (req, res, next) {
  res.render('pages/login')
})

//  POST  /signin user signin
router.post('/', checkNotLogin, function (req, res, next) {
  res.redirect('/signin/admin')
})

// GET /admin page of admin
router.get('/admin', checkNotLogin, function (req, res, next) {
  res.render('admin/index')
})

module.exports = router
