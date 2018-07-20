const express = require('express')
const router = express.Router()

// GET /signout user sign out
router.get('/', function (req, res, next) {
  // 清空session中用户信息
  req.session.user = null
  req.flash('success', '登出成功')
  res.redirect('/posts')
})

module.exports = router
