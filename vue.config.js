const fs = require('fs')

module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  configureWebpack: {
    entry: ['@babel/polyfill', './src/main.js']
  },
  'devServer': {
    https: {
      key: fs.readFileSync('./dev/localhost.key'),
      cert: fs.readFileSync('./dev/localhost.crt')
    },
    'host': 'localhost',
    'port': 443
  }
}

// Teste
