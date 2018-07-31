const path = require('path')
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const bodyParser = require('body-parser')
const config = require('config-lite')(__dirname)
const routes = require('./routes')
const pkg = require('./package')
const favicon = require('serve-favicon')

const app = express()

// set template directory
app.set('views', path.join(__dirname, 'views'))

// set ejs as template engine
app.set('view engine', 'ejs')

// set a favicon,must use serve-favicon middleware
app.use(favicon(path.join(__dirname, 'public', 'icon', 'favicon.ico')))

// set static files directory
app.use(express.static(path.join(__dirname, 'public')))

// session middleware
app.use(session({
  name: config.session.key, // 设置cookie中保存session id的字段名
  secret: config.session.secret, // 通过设置secret来计算hash值并放在cookie中,使产生的signedCookie防篡改
  resave: true, // 强制更新session
  saveUninitialized: false, // 设置为false,强制创建一个session,即使用户未登录
  cookie: {
    maxAge: config.session.maxAge // 过期时间,过期后cookie中的session id自动删除
  },
  store: new MongoStore({ // 将session存储到mongodb
    url: config.mongodb // mongodb地址
  })
}))

// flash中间件,用来显示通知
app.use(flash())

// 处理表单提交的中间件
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// 设置模板全局变量
app.locals.blog = {
  title: 'Dalsen-blog',
  author: 'Dalsen'
}

// 模板必须变量
app.use((req, res, next) => {
  res.locals.user = req.session.user
  res.locals.success = req.flash('success').toString()
  res.locals.error = req.flash('error').toString()
  next()
})

// router
routes(app)

// listen port and start program
app.listen(config.port, function () {
  console.log(`${pkg.name} listening on port ${config.port}`)
})
