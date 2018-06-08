const express = require('express')
const router = express.Router()
const checkLogin = require('../middlewares/check').checkLogin

// POST /comments leave a message
router.post('/', checkLogin, function (req, res, next) {
  res.send('leave a message')
})

//GET /comments/:commentId/remove remove a message
router.get(':commentId/remove', checkLogin, function(req,res,next){
  res.send('remove a message')
})

module.exports = router
