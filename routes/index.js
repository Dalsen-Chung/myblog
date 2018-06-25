module.exports = function (app) {
  app.get('/', function (req, res) {
    res.redirect('/posts')
  })
  app.use('/signin', require('./signin'))
  app.use('/signout', require('./signout'))
  app.use('/about', require('./about'))
  app.use('/posts', require('./posts'))
  app.use('/archive', require('./archive'))
  app.use('/comments', require('./comments'))
  app.use('/slideshow', require('./slideshow'))
}
