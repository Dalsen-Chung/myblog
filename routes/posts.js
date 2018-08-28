const express = require('express')
const fs = require('fs')
const router = express.Router()
const moment = require('moment')
const multer = require('multer')
const upload = multer({dest: 'public/img/upload'})
const PostModel = require('../models/posts')
const User = require('../models/user')

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
router.post('/create', checkNotLogin, upload.single('thumbnail'), function (req, res, next) {
  const author = req.session.user.name
  const title = req.body.title
  const digest = req.body.digest
  const content = req.body.content
  const time = moment().format('YYYY-MM-DD HH:MM')
  const tags = req.body.tags
  const img = req.file
  const authorId = req.session.user._id

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
    if (!img) {
      throw new Error('缺少缩略图')
    }
  } catch (e) {
    img && fs.unlink(img.path)
    req.flash('adminError', e.message)
    return res.redirect('/posts/create')
  }

  let post = {
    author: author,
    title: title,
    digest: digest,
    content: content,
    time: time,
    tags: tags,
    img: img.filename
  }

  PostModel.create(post)
    .then((result) => {
      // 此post是插入MongoDB后的值，包含_id
      post = result.ops[0]
      User.incAQ(authorId)
      req.flash('adminSuccess', '文章发表成功')
      return res.redirect(`/posts/${post._id}`)
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
    }).catch((e) => {
      req.flash('adminError', e.message)
    })
})

// POST /posts/edit/:postId update a post
router.post('/edit/:postId', checkNotLogin, function (req, res, next) {
  const postId = req.params.postId
  const author = req.session.user.name
  const title = req.body.title
  const digest = req.body.digest
  const content = req.body.content
  const tags = req.body.tags

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
        req.flash('adminSuccess', '文章编辑成功')
        // 编辑成功后跳转到上一页
        return res.redirect(`/posts/${postId}`)
      }).catch(next)
    })
})

//  GET /posts/remove/:postId remove a post
router.get('/remove/:postId', checkNotLogin, function (req, res, next) {
  const postId = req.params.postId
  const author = req.session.user.name
  const authorId = req.session.user._id

  PostModel.getRawPostById(postId)
    .then((post) => {
      if (!post) {
        throw new Error('文章不存在')
      }
      if (author.toString() !== post.author.toString()) {
        throw new Error('权限不足,不可删除他人文章')
      }
      PostModel.deletePostById(postId)
        .then(() => {
          User.decAQ(authorId) // 删除文章后,作者发布量减1
          req.flash('adminSuccess', '文章删除成功')
          return res.redirect('/admin/artical')
        })
    }).catch((e) => {
      req.flash('adminError', e.message)
      return res.redirect('/admin/artical')
    })
})

module.exports = router
