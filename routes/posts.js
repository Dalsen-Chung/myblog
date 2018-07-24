const express = require('express')
const fs = require('fs')
const path = require('path')
const router = express.Router()
const moment = require('moment')
const PostModel = require('../models/posts')

const checkNotLogin = require('../middlewares/check').checkNotLogin

//  GET /posts 所有用户或者特定用户的文章页
router.get('/', function (req, res, next) {
  PostModel.getPosts().then((posts) => {
    res.render('pages/post', {
      posts: posts
    })
  }).catch(next)
})

router.get('/resources', function (req, res, next) {
  res.send('pages/resources')
})

//  POST  /posts/create  发表一篇文章
router.post('/create', checkNotLogin, function (req, res, next) {
  const author = req.session.user.name
  const title = req.fields.title
  const digest = req.fields.digest
  const content = req.fields.content
  const time = moment().format('YYYY-MM-DD HH:MM')
  const tags = req.fields.tags
  const img = req.files.thumbnail.path.split(path.sep).pop()

  // 校验参数
  try {
    if (!title.length) {
      throw new Error('请填写标题')
    }
    if (!digest.length) {
      throw new Error('请填写摘要')
    }
    if (!content.length) {
      throw new Error('请填写内容')
    }
    if (!tags.length) {
      throw new Error('请填写文章标签')
    }
  } catch (e) {
    fs.unlink(req.files.thumbnail.path)
    req.flash('error', e.message)
    return res.redirect('/posts/create')
  }

  let post = {
    author: author,
    title: title,
    digest: digest,
    content: content,
    time: time,
    tags: tags,
    img: img
  }

  PostModel.create(post)
    .then((result) => {
      // 此post是插入MongoDB后的值，包含_id
      post = result.ops[0]
      req.flash('success', '发表成功')
      // res.redirect(`/post/${post._id}`)
      res.send('已发表')
    }).catch(next)
})

//  GET /posts/create  发表文章页
router.get('/create', checkNotLogin, function (req, res, next) {
  res.render('admin/pages/artical')
})

//  GET /posts/:postId  单独一篇文章页
router.get('/:postId', function (req, res, next) {
  const postId = req.params.postId
  Promise.all([
    PostModel.getPostById(postId), // 获取指定文章
    PostModel.incPv(postId) // pv加1
  ]).then((result) => {
    const post = result[0]
    if (!post) {
      throw new Error('该文章不存在')
    }
    res.render('pages/post-content', {post: post})
  }).catch(next)
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
