const config = require('config-lite')(__dirname)
const Mongolass = require('mongolass')
const mongolass = new Mongolass()
mongolass.connect(config.mongodb)

exports.User = mongolass.model('User', {   //用户表的scheme
  name: {
    type: 'strng',
    required: true  //  字段必须
  },
  password: {
    type: 'strng',
    required: true
  },
  avatar: {
    type: 'string',
    required: true
  },
  gender: {
    type: 'string',
    enum: ['m', 'f', 'x'],
    default: 'x'  //默认值
  },
  bio: {
    type: 'string',
    required: true
  }
})

exports.User.index({
  name: 1
}, {
  unique: true
}).exec() //根据用户名找到用户,用户名全局唯一
