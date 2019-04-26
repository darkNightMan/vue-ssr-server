
const { createBundleRenderer } = require('vue-server-renderer')
const path = require('path') 
const fs = require('fs')
const resolve = file => path.resolve(__dirname, file)
const serverBundle = require('../../clinet/dist/vue-ssr-server-bundle.json')   // 服务的 bundle
const template = fs.readFileSync(resolve('../../clinet/dist/index.ssr.html'), 'utf-8')  // 渲染模板


const createRenderer = (serverbundle, template) => {
  // 生成服务端渲染函数
  return createBundleRenderer(serverbundle, {
    // 推荐
    runInNewContext: false,
    // 模板html文件
    template: template,   
      // 缓存
    // cache: require('lru-cache')({
    //   max: 1000,
    //   maxAge: 1000 * 60 * 15
    // })
  })
}
const renderToString = (renderer, context) =>{
  return new Promise((resolve, reject) => {
    renderer.renderToString(context, (err, html) => {
      err ? reject(err) : resolve(html)
    })
  })
}

class SsrController {
   async application (req, res) {  
      res.setHeader('Content-Type', 'text/html')
    let renderer = createRenderer(serverBundle, template)
    try {
      res.setHeader('Content-Type', 'text/html')
      const context = { title: 'SSR我来啦', url: req.url  }
      const html = await renderToString(renderer, context)
      res.send(html)
    } catch (err) {
      res.sendViews(err)
    }
  }
}

module.exports = new SsrController()