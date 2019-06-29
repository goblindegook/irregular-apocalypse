export default {
  webpack(config, env, helpers, options) {
    helpers.getLoadersByName(config, 'postcss-loader').forEach(({ loader }) => {
      delete loader.options
    })
  }
}
