module.exports = {
  port: 3000,   //程序启用监听的端口
  session: {    //express-session的配置信息
    secret: 'myblog',
    key: 'myblog',
    maxAge: 2592000000
  },
  mongodb: 'mongodb://localhost:27017/myblog'  //mongoDB的地址,以mongodb://作为协议开头,myblog为db名
}
