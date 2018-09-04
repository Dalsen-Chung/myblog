const Post = require('../lib/mongo').Post
const marked = require('marked')

// 将post的content从Markdown转换为html1
Post.plugin('contentToHtml', {
  afterFind: (posts) => {
    return posts.map((post) => {
      post.content = marked(post.content)
      return post
    })
  },
  afterFindOne: (post) => {
    if (post) {
      post.content = marked(post.content)
    }
    return post
  }
})

module.exports = {
  // 创建一篇文章
  create: (post) => {
    return Post.create(post).exec()
  },

  // 通过文章id获取一篇文章(markdown转为html)
  getPostById: (postId) => {
    return Post
      .findOne({_id: postId})
      .populate({path: 'author', model: 'User'})
      .addCreatedAt()
      .contentToHtml()
      .exec()
  },

  // 按创建时间降序获取所有用户文章或某个特定用户的所有文章(markdown转html)
  getPosts: (author) => {
    const query = {}
    if (author) {
      query.author = author
    }
    return Post
      .find(query)
      .populate({path: 'author', model: 'User'})
      .sort({_id: -1})
      .addCreatedAt()
      .contentToHtml()
      .exec()
  },

  // 按创建时间降序获取所有用户文章(未转HTML)
  getRawPosts: () => {
    return Post
      .find()
      .populate({path: 'author', model: 'User'})
      .sort({_id: -1})
      .addCreatedAt()
      .exec()
  },
  // 通过文章id给pv加1
  incPv: (postId) => {
    return Post
      .update({_id: postId}, {$inc: {pv: 1}})
      .exec()
  },

  // 通过文章id获取文章(未转换markdown,用于文章修改)
  getRawPostById: (postId) => {
    return Post
      .findOne({_id: postId})
      .populate({ path: 'author', model: 'User' })
      .exec()
  },

  // 通过文章id更新一篇文章
  updatePostById: (postId, data) => {
    return Post.update({_id: postId}, {$set: data}).exec()
  },

  // 通过文章id删除一篇文章
  deletePostById: (postId) => {
    return Post.deleteOne({_id: postId}).exec()
  },

  // 获取根据阅读量排名的热门文章
  getPostsByPv: (postNum) => {
    return Post.find().sort({pv: -1}).limit(postNum).exec()
  },

  // 获取所有文章标签
  getAllPostsTags: () => {
    return Post.find().select({tags: 1, _id: 0}).exec()
  },

  // 根据标签获取带该标签的文章
  getPostsByTag: (tag) => {
    let re = new RegExp(tag) // 正则表达的字面量表达方法不能存放变量,只能用对象的方式创建正则表达式
    return Post.find({tags: re}).exec()
  }
}
