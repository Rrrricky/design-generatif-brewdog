module.exports = {
  chainWebpack: config => {
    config.module
      .rule('webpack-obj-loader')
      .test(/\.obj$/)
      .use('webpack-obj-loader')
        .loader('webpack-obj-loader')
      .end()
  },
  pluginOptions: {
    quasar: {
      importStrategy: 'manual',
      rtlSupport: false
    }
  },
  transpileDependencies: [
    'quasar',
    'quasar'
  ]
};
