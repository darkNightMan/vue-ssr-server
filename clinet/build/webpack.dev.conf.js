const path = require('path'); //node的路径模块
const config = require('../config/devServerConf.js') // devServer 配置
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')

module.exports = merge(baseConfig,{
  devtool: '#source-map',
  devServer: {
    host: config.dev.host,
    hot: config.dev.hot,
    port: config.dev.port,
    open: config.dev.autoOpenBrowser,
    contentBase: path.resolve(__dirname,'../'),
    quiet: false,
    proxy: config.dev.proxyTable
  },
  plugins :[
    new webpack.DefinePlugin({  // 设置node 全局变量 判断当前build 环境
      'process.env': config.dev.env
    }),
     //热更新插件
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.dev.html',
      favicon: path.resolve('favicon.ico'),
      inject: true
    }),
    // service-worker
    // new SWPrecacheWebpackPlugin({
    //   cacheId: 'vue-ssr',
    //   filename: 'service-worker.js',
    //   staticFileGlobs: ['dist/**/*.{js,html,css}'],
    //   minify: true,
    //   stripPrefix: 'dist/'
    // }),
    // 清单
    new WebpackPwaManifest({
      name: 'ssr',
      short_name: 'MyPWA',
      description: 'vue-ssr!',
      background_color: '#ffffff',
      crossorigin: 'use-credentials', //can be null, use-credentials or anonymous
      icons: [
        {
          src: path.resolve('logos.png'),
          sizes: [96, 128, 192, 256, 384, 512] // multiple sizes
        },
        {
          src: path.resolve('logos.png'),
          size: '1024x1024' // you can also use the specifications pattern
        }
      ]
    })
  ]
})