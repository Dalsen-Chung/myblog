const express = require('express')
const router = express.Router()
const checkLogin = require('../middlewares/check').checkLogin
const sha1 = require('sha1')
const UserModel = require('../models/user')

//  GET /signin page of signin
router.get('/', checkLogin, function (req, res, next) {
  res.render('pages/login')
})

//  POST  /signin user signin
router.post('/', function (req, res, next) {
  const account = req.body.account
  const password = req.body.password

  // 校验参数
  try {
    if (!account.length) {
      throw new Error('请填写用户名')
    }
    if (!password.length) {
      throw new Error('请填写密码')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('back')
  }

  UserModel.getUserByAccount(account)
    .then((user) => {
      if (!user) {
        req.flash('error', '用户不存在')
        return res.redirect('back')
      }
      // 检查密码是否匹配
      if (sha1(password) !== user.password) {
        req.flash('error', '用户名或密码错误')
        return res.redirect('back')
      }
      req.flash('success', '登录成功')
      // 用户信息写入session
      req.session.user = user
      // 跳转到主页
      res.redirect('/admin/account')
    })
    .catch(next)
})

module.exports = router
