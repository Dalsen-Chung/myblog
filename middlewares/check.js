module.exports = {
  checkLogin: function (req, res, next) {
    if (!req.session.user) {
      req.flash('error', '登录')
      return res.redirect('/signin')
    }
    next()
  },
  checkNotLogin: function (req, res, next) {
    if (req.session.user) {
      req.flash('error', '已登录')
      return res.redirect('back') //返回之前的界面
    }
    next()
  }
}
