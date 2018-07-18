const express = require('express')
const router = express.Router()
const checkNotLogin = require('../middlewares/check').checkNotLogin

// GET /admin page of admin
router.get('/', checkNotLogin, function (req, res, next) {
  res.render('admin/pages/account')
})

router.post('/regist', checkNotLogin, function (req, res, next) {
  console.log('aaa')
})

module.exports = router
