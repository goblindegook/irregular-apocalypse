const purgecss = require('@fullhuman/postcss-purgecss')

const purgecssOptions = {
  content: ['./src/**/*.html', './src/**/*.tsx'],
  whitelist: ['body', 'html', 'main', 'img', 'button', 'input', '[type="checkbox"]'],
  defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
}

module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    ...(process.env.NODE_ENV === 'production' ? [purgecss(purgecssOptions)] : []),
    require('cssnano')({
      preset: 'default'
    })
  ]
}
