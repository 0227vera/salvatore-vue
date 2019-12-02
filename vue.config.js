const path = require('path')
const config = require('./package.json')
const autoprefixer = require('autoprefixer')

module.exports = {
  publicPath: './',
  indexPath: path.resolve(__dirname, './dist/' + config.version + '/index.html'),
  outputDir: path.resolve(__dirname, './dist/' + config.version),
  assetsDir: 'static',
  chainWebpack: config => {
    // webpack中图片压缩默认的大小好像是4Kb，在这个地方变大一点
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, {
        limit: 10000
      }))
    // 移除 prefetch 插件
    config.plugins.delete('prefetch')
    // 移除 preload 插件，这两个可以适当的加快首次加载
    config.plugins.delete('preload')
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer()
        ]
      }
    }
  },
  devServer: {
    open: true,
    port: 3000,
    https: false,
    hotOnly: false,
    proxy: require('./proxy')
  },
  // 这个地方是使用echarts的webpack配置，如果没有使用echarts的话，可以不要这个
  transpileDependencies: [ 'vue-echarts', 'resize-detector' ]
}
