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
    return res.render('pages/post', {
      posts: posts
    })
  }).catch(next)
})

router.get('/resources', function (req, res, next) {
  return res.send('pages/resources')
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
      return res.redirect(`/post/${post._id}`)
    }).catch(next)
})

//  GET /posts/create  发表文章页
router.get('/create', checkNotLogin, function (req, res, next) {
  return res.render('admin/pages/artical')
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
    return res.render('pages/post-content', {post: post})
  }).catch(next)
})

//  GET /posts/edit/:postId 更新一篇文章页
router.get('/edit/:postId', checkNotLogin, function (req, res, next) {
  const postId = req.params.postId
  const author = req.session.user.name
  PostModel.getRawPostById(postId)
    .then((post) => {
      if (!post) {
        throw new Error('该文章不存在')
      }
      if (author.toString() !== post.author.toString()) {
        throw new Error('权限不足')
      }
      return res.render('admin/pages/editArtical', {
        active: 'artical',
        post: post
      })
    })
})

// POST /posts/edit/:postId update a post
router.post('/edit/:postId', checkNotLogin, function (req, res, next) {
  const postId = req.params.postId
  const author = req.session.user.name
  const title = req.fields.title
  const digest = req.fields.digest
  const content = req.fields.content
  const tags = req.fields.tags

  // 参数校验
  try {
    if (!title) {
      throw new Error('请填写标题')
    }
    if (!digest) {
      throw new Error('请填写摘要')
    }
    if (!content) {
      throw new Error('请填写内容')
    }
    if (!tags) {
      throw new Error('请填写标签')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('back')
  }

  PostModel.getRawPostById(postId)
    .then((post) => {
      if (!post) {
        throw new Error('文章不存在')
      }
      if (author.toString() !== post.author.toString()) {
        throw new Error('权限不足')
      }
      PostModel.updatePostById(postId, {
        title: title,
        digest: digest,
        content: content,
        tags: tags
      }).then(() => {
        req.flash('success', '编辑文章成功')
        // 编辑成功后跳转到上一页
        return res.redirect(`/posts/${postId}`)
      }).catch(next)
    })
})

//  GET /posts/remove/:postId remove a post
router.get('/remove/:postId', checkNotLogin, function (req, res, next) {
  const postId = req.params.postId
  const author = req.session.user.name

  PostModel.getRawPostById(postId)
    .then((post) => {
      if (!post) {
        throw new Error('文章不存在')
      }
      if (author.toString() !== post.author.toString()) {
        throw new Error('权限不足')
      }
      PostModel.deletePostById(postId)
        .then(() => {
          req.flash('success', '删除成功')
          return res.redirect('/admin/artical')
        })
    })
})

module.exports = router
