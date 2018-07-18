const express = require('express')
const router = express.Router()
const checkNotLogin = require('../middlewares/check').checkNotLogin

// GET /admin page of admin
router.get('/', checkNotLogin, function (req, res, next) {
  res.render('admin/pages/account')
})

module.exports = router
