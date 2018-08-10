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
  }
}
