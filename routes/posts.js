const express = require('express')
const router = express.Router()

const checkNotLogin = require('../middlewares/check').checkNotLogin

//  GET /posts 所有用户或者特定用户的文章页
router.get('/', function (req, res, next) {
  res.render('pages/post')
})

router.get('/resources', function (req, res, next) {
  res.send('pages/resources')
})

//  POST  /posts/create  发表一篇文章
router.post('/create', checkNotLogin, function (req, res, next) {
  res.send('发表文章')
})

//  GET /posts/create  发表文章页
router.get('/create', checkNotLogin, function (req, res, next) {
  res.render('admin/pages/artical')
})

//  GET /posts/:postId  单独一篇文章页
router.get('/:postId', function (req, res, next) {
  res.send('单独一篇文章页')
})
//  GET /posts/:postId/edit 更新一篇文章页
router.get(':postId/edit', checkNotLogin, function (req, res, next) {
  res.send('page be use to edit posts')
})

// POST /posts/:postId/edit update a post
router.post(':postId/edit', checkNotLogin, function (req, res, next) {
  res.send('update a post')
})

//  GET /posts/:postId/remove remove a post
router.get(':postId/remove', checkNotLogin, function (req, res, next) {
  res.send('remove a post')
})

module.exports = router
