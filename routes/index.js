module.exports = function (app) {
  app.get('/', function (req, res) {
    return res.redirect('/posts')
  })
  app.use('/signin', require('./signin'))
  app.use('/signout', require('./signout'))
  app.use('/about', require('./about'))
  app.use('/posts', require('./posts'))
  app.use('/archive', require('./archive'))
  app.use('/comments', require('./comments'))
  app.use('/slideshow', require('./slideshow'))
  app.use('/admin', require('./admin'))
  app.use((req, res) => {
    if (!res._headerSent) {
      return res.status(404).render('404')
    }
  })
}
