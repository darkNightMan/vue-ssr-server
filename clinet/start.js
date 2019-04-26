const express = require('express')
const fs = require('fs')
var http = require('http');
var https = require('https');
const path = require('path')
const server = express()
const { createBundleRenderer } = require('vue-server-renderer')
const resolve = file => path.resolve(__dirname, file)

// const clientBundle = require('./dist/vue-ssr-client-manifest.json') // 客户端 bundle
// const serverBundle = require('./dist/vue-ssr-server-bundle.json')   // 服务的 bundle
// const template = fs.readFileSync(resolve('./dist/index.ssr.html'), 'utf-8')  // 渲染模板
const privateKey  = fs.readFileSync('./key/private.pem', 'utf8')
const certificate = fs.readFileSync('./key/file.crt', 'utf8')
const credentials = {key: privateKey, cert: certificate}
const PORT = 18080;
const SSLPORT = 18081;
const httpServer = http.createServer(server);
const httpsServer = https.createServer(credentials, server);

let renderer
  // 生成服务端渲染函数
  function createRenderer (serverbundle ,template) {
    // 生成服务端渲染函数
    return createBundleRenderer(serverbundle, {
      // 推荐
      runInNewContext: false,
      // 模板html文件
      template: template,
      // client manifest
      // clientManifest: clientBundles
       // 缓存
      cache: require('lru-cache')({
        max: 1000,
        maxAge: 1000 * 60 * 15
      })
    })
  }
  
  

// const serve = (path, cache) => express.static(resolve(path), { // 静态资源设置缓存
//   maxAge: cache ? 60 * 60 * 24 * 30 : 0 
// })
require('./build/setup-dev-server')(server, (bundle, template) => {
  renderer = createRenderer(bundle, template)  
})
console.log(renderer)
// server.use('/dist', serve('./dist', true)) // 静态资源
server.use( express.static('./dist'));

// renderer = createRenderer(serverBundle, template)

// 
function renderToString (renderer, context) {
  return new Promise((resolve, reject) => {
    renderer.renderToString(context, (err, html) => {
      err ? reject(err) : resolve(html)
    })
  })
}

server.get('*',async(req, res) => {
  console.log(renderer)
  // 未渲染好返回
  if (!renderer) {
    return res.end('waiting for compilation... refresh in a moment.')
  }
  const handleError = err => {
    if (err.url) {
      res.redirect(err.url)
    } else if (err.code === 404) {
      res.status(404).send('404')
    } else {
      res.status(500).send('500')
      console.error(`error during render : ${req.url}`)
      console.error(err.stack)
    }
  }
 try {
    res.setHeader('Content-Type', 'text/html')
    const context = { title: 'SSR我来啦', url: req.url  }
    const html = await renderToString(renderer, context)
    res.send(html)
  } catch (error) {
    handleError(error)
  }
}) 

httpServer.listen(PORT, function() {
  console.log('HTTP Server is running on: http://127.0.0.1:%s', PORT);
});
httpsServer.listen(SSLPORT, function() {
  console.log('HTTPS Server is running on: https://127.0.0.1:%s', SSLPORT);
});









