const config = require('config-lite')(__dirname)
const Mongolass = require('mongolass')
const mongolass = new Mongolass()
const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')
mongolass.connect(config.mongodb, { useNewUrlParser: true })

// 根据 id 生成创建时间 created_at
mongolass.plugin('addCreatedAt', {
  afterFind: (results) => {
    results.forEach((item) => {
      item.create_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:MM')
    })
    return results
  },
  afterFindOne: (results) => {
    if (results) {
      results.create_at = moment(objectIdToTimestamp(results._id)).format('YYYY-MM-DD HH:MM')
    }
    return results
  }
})

exports.User = mongolass.model('User', { // 用户表的scheme
  name: {
    type: 'string',
    required: true // 字段必须
  },
  account: {
    type: 'string',
    required: true
  },
  password: {
    type: 'string',
    required: true
  },
  times: {
    type: 'number',
    required: true
  }
})

exports.User.index({
  name: 1
}, {
  unique: true
}).exec() // 根据用户名找到用户,用户名全局唯一

exports.Post = mongolass.model('Post', {
  author: {
    type: Mongolass.Types.ObjectId,
    required: true
  },
  title: {
    type: 'string',
    required: true
  },
  digest: {
    type: 'string',
    required: true
  },
  content: {
    type: 'string',
    required: true
  },
  time: {
    type: 'string',
    required: true
  },
  tags: {
    type: 'string',
    required: true
  },
  pv: {
    type: 'string',
    required: true
  },
  img: {
    type: 'string',
    required: true
  }
})

exports.Post.index({author: 1, _id: -1}).exec() // 按创建时间降序查看文章列表
