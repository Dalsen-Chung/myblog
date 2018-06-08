const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin

//  GET /posts 所有用户或者特定用户的文章页
router.get('/', function (req, res, next) {
  res.render('post')
})

//  POST  /posts/create  发表一篇文章
router.post('/create', checkLogin, function (req, res, next) {
  res.send('发表文章')
})

//  GET /posts/create  发表文章页
router.get('/create', checkLogin, function (req, res, next) {
  res.send('发表文章页')
})

//  GET /posts/:postId  单独一篇文章页
router.get('/:postId', function (req, res, next) {
  res.send('单独一篇文章页')
})

//  GET /posts/:postId/edit 更新一篇文章页
router.get(':postId/edit', checkLogin, function (req, res, next) {
  res.send('page be use to edit posts')
})

// POST /posts/:postId/edit update a post
router.post(':postId/edit', checkLogin, function (req, res, next) {
  res.send('update a post')
})

//  GET /posts/:postId/remove remove a post
router.get(':postId/remove', checkLogin, function (req, res, next) {
  res.send('remove a post')
})

module.exports = router
