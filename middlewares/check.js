module.exports = {
  checkLogin: function (req, res, next) {
    if (req.session.user) {
      req.flash('success', '已登录')
      return res.redirect('/admin/account')
    }
    next()
  },
  checkNotLogin: function (req, res, next) {
    if (!req.session.user) {
      req.flash('error', '未登录')
      return res.redirect('/signin') // 返回登录页
    }
    next()
  }
}
