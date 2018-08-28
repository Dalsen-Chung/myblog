const express = require('express')
const sha1 = require('sha1')
const router = express.Router()
const checkNotLogin = require('../middlewares/check').checkNotLogin
const UserModel = require('../models/user')
const PostModel = require('../models/posts')

// GET /admin page of account
router.get('/account', checkNotLogin, function (req, res, next) {
  UserModel.getAllUsers().then((users) => {
    res.render('admin/pages/account', {
      active: 'account',
      users: users
    })
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
    if (!(account.length >= 6)) {
      throw new Error('账号至少 6 个字符')
    }
    if (!(password.length >= 6)) {
      throw new Error('密码至少 6 个字符')
    }
  } catch (e) {
    req.flash('adminError', e.message)
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
      // user = result.ops[0]
      // // 删除敏感信息-密码,并将用户信息存入session
      // delete user.password
      // req.session.user = user
      // 写入flash
      req.flash('adminSuccess', '账号注册成功')
      // 跳转到账户页面
      res.redirect('/admin/account')
    })
    .catch(function (e) {
      // 用户名被占用则跳回注册页
      if (e.message.match('duplicate key')) {
        req.flash('adminError', '用户名已被占用')
        return res.redirect('/admin/account')
      }
      next(e)
    })
})

router.get('/remove/:id', checkNotLogin, function (req, res, next) {
  const _id = req.params.id
  const name = req.session.user.name
  UserModel.getUserById(_id).then((user) => {
    if (name !== user.name) {
      throw new Error('无删除他人账号的权限!')
    } else {
      UserModel.deleteUserById(_id).then(() => {
        req.session.user = null
        req.flash('success', '账号删除成功,请重新登录!')
        return res.redirect('/signin')
      })
    }
  }).catch((e) => {
    req.flash('adminError', e.message)
    return res.redirect('/admin/account')
  })
})

// 修改账户页面
router.get('/edit/:id', checkNotLogin, function (req, res, next) {
  const _id = req.params.id
  const author = req.session.user.name
  UserModel.getUserById(_id).then((user) => {
    if (!user) {
      throw new Error('用户不存在')
    }
    if (author.toString() !== user.name) {
      throw new Error('权限不足，无法修改他人账户')
    }
    res.render('admin/pages/editAccount', {
      user: user,
      active: 'account'
    })
  }).catch((e) => {
    req.flash('adminError', e.message)
    return res.redirect('/admin/account')
  })
})

// 修改账户密码
router.post('/edit', checkNotLogin, function (req, res, next) {
  const name = req.body.name
  const userId = req.body._id
  const password = req.body.password
  const passwordSec = req.body.password_sec
  try {
    if (!password) {
      throw new Error('请输入新密码')
    }
    if (!passwordSec) {
      throw new Error('再次输入新密码不能为空')
    }
    if (password !== passwordSec) {
      throw new Error('两次输入的密码不一致')
    }
    if (!name) {
      throw new Error('请输入要修改的昵称')
    }
  } catch (e) {
    req.flash('adminError', e.message)
    return res.redirect('back')
  }

  UserModel.updateUserById(userId, {
    name: name,
    password: sha1(password)
  })
})
module.exports = router
