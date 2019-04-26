
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const buildconfig = require('../config/buildConf')
const devServer = require('../config/devServerConf')
const baseWebpackConfig = require('./webpack.base.conf')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin  = require('html-webpack-plugin')
const manifestPlugin = require('pwa-manifest-webpack-plugin')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')

const assetsPath = function (_path) { // 
  /* 兼容多平台拼接编译输出文件路径 */
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? buildconfig.build.assetsSubDirectory
    : devServer.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path)
}
const proconfig = merge(baseWebpackConfig, {  
  mode: 'development',
  devtool: '#source-map' ,
  output: {
    path: buildconfig.build.assetsRoot,
    filename: assetsPath('js/[name].js'),
    chunkFilename: assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': buildconfig.build.env
    }),   
    // 这个插件应该只用在 production 配置中，并且在loaders链中不使用 style-loader, 特别是在开发中使用HMR，因为这个插件暂时不支持HMR
    new MiniCssExtractPlugin({ // 打包css  webpack4 之后貌似打包在js里面
      filename: 'css/[name].css',
      chunkFilename: '[id].css',
    }),  
    // 此插件在输出目录中
       // 生成 `vue-ssr-client-manifest.json`。
    // new VueSSRClientPlugin(),

    new HtmlWebpackPlugin({
      filename: buildconfig.build.index,
      template: path.resolve(__dirname, '../index.ssr.html'),
      inject: true,
      favicon: path.resolve(__dirname, '../favicon.ico'),
      // minify: { // 压缩的方式
      //   removeComments: true,
      //   collapseWhitespace: true,
      //   removeAttributeQuotes: true       
      // },
      // // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      // chunksSortMode: 'dependency'
    }),
    // service-worker
    new SWPrecacheWebpackPlugin({
      cacheId: 'vue-ssr',
      filename: 'service-worker.js',
      staticFileGlobs: ['dist/**/*.{js,html,css}'],
      minify: true,
      stripPrefix: 'dist/'
    }),
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
    }),
  ],
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          output: {
            comments: false
          },
          compress: {
            warnings: false,
            drop_debugger: true,
            drop_console: true
          }
        }
      }),
    ]
   }
})
console.log(proconfig,'clinet---------------')
module.exports = proconfig
