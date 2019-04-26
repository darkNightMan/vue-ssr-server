const express = require('express')
const fs = require('fs')
const http = require('http');
const path = require('path')
const https = require('https');
const app = express()
const utils = require('./utils')
console.log(path.resolve(__dirname, './key/private.pem'))
const privateKey  = fs.readFileSync(path.resolve(__dirname, './key/private.pem'), 'utf8')
const certificate = fs.readFileSync(path.resolve(__dirname,'./key/file.crt'), 'utf8')
const { HTTPROT, HTTPSROT} = require('./config')
const routers = require('./router')
const httpServer = http.createServer(app);
const httpsServer = https.createServer({key: privateKey, cert: certificate}, app);

app.use(express.static(path.join(__dirname,'../clinet/dist/')));
app.use(express.static(path.join(__dirname, '../clinet/dist/service-worker.js')))
// 对res的扩展
app.use(utils.resExtend)
// 注册路由
routers(app)

httpServer.listen(HTTPROT, function() {
  console.log('HTTP Server is running on: http://127.0.0.1:%s', HTTPROT);
});
httpsServer.listen(HTTPSROT, function() {
  console.log('HTTPS Server is running on: https://127.0.0.1:%s', HTTPSROT);
});









