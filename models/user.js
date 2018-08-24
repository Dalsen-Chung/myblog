const User = require('../lib/mongo').User

module.exports = {
  create: (user) => {
    return User.create(user).exec()
  },

  // 通过用户名获取用户信息
  getUserByAccount: (account) => {
    return User
      .findOne({account: account})
      .addCreatedAt()
      .exec()
  },

  // 获取所有用户信息
  getAllUsers: () => {
    return User.find().exec()
  },

  // 根据用户id获取指定用户
  getUserById: (id) => {
    return User.findOne({_id: id}).exec()
  },

  // 删除指定id的用户
  deleteUserById: (id) => {
    return User.deleteOne({_id: id}).exec()
  },

  // 每发表一篇文章,文章量+1  AQ即artical quantity
  incAQ: (id) => {
    return User.update({_id: id}, {$inc: {times: 1}}).exec()
  }
}
