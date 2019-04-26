


const article = require('../data/article.json')
const weather = require('../data/weather.json')
class Test {
  weather (req, res) {
    res.sendOk(weather)
  }
  article (req, res) {
     //设置允许跨域的域名，*代表允许任意域名跨域
     res.header("Access-Control-Allow-Origin","*");
     //允许的header类型
     res.header("Access-Control-Allow-Headers","content-type");
     //跨域允许的请求方式 
    res.sendOk(article)
  }
}

module.exports = new Test()