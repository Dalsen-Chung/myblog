const express = require('express')
const router = express.Router()

router.get('/', function (req, res, next) {
  res.send('about')
})

router.get('/admin', function (req, res, next) {
  res.render('admin/pages/about', {
    active: 'about'
  })
})

router.post('/modify', function (req, res, next) {
  res.send('modify about Me')
})

module.exports = router
