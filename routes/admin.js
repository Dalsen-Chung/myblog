const express = require('express')
const sha1 = require('sha1')
const router = express.Router()
const checkNotLogin = require('../middlewares/check').checkNotLogin
const UserModel = require('../models/user')
const PostModel = require('../models/posts')

// GET /admin page of account
router.get('/account', checkNotLogin, function (req, res, next) {
  res.render('admin/pages/account', {
    active: 'account'
  })
})

// GET /admin page of artical
router.get('/artical', checkNotLogin, function (req, res, next) {
  PostModel.getRawPosts().then((posts) => {
    res.render('admin/pages/artical', {
      posts: posts,
      active: 'artical'
    })
  })
})

// POST /regist 后台用户注册,注册后可发布文章
router.post('/regist', checkNotLogin, function (req, res, next) {
  const name = req.body.name
  const account = req.body.account
  let password = req.body.password

  // 参数校验
  try {
    if (!(name.length >= 1 && name.length <= 10)) {
      throw new Error('名字请限制在 1-10 个字符')
    }
    if (!(account.length > 6)) {
      throw new Error('账号至少 6 个字符')
    }
    if (!(password.length > 6)) {
      throw new Error('密码至少 6 个字符')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('/admin/account')
  }

  // sha1加密
  password = sha1(password)

  // 待写入数据库的用户信息
  let user = {
    name: name,
    account: account,
    password: password,
    times: 0
  }

  // 用户信息写入数据库
  UserModel.create(user)
    .then(function (result) {
      // 此user是插入MongoDB后的值,包含_id
      user = result.ops[0]
      // 删除敏感信息-密码,并将用户信息存入session
      delete user.password
      req.session.user = user
      // 写入flash
      req.flash('success', '注册成功')
      // 跳转到账户页面
      res.redirect('/admin/account')
    })
    .catch(function (e) {
      // 用户名被占用则跳回注册页
      if (e.message.match('duplicate key')) {
        req.flash('error', '用户名已被占用')
        res.redirect('/admin/account')
      }
      next(e)
    })
})

module.exports = router
