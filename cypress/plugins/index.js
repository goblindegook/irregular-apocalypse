const wp = require('@cypress/webpack-preprocessor')

module.exports = on => {
  on('file:preprocessor', wp({
    webpackOptions: require('../webpack.config')
  }))
}
