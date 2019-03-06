import { resolve } from 'path'

/**
 * Function that mutates original webpack config.
 * Supports asynchronous changes when promise is returned.
 *
 * @param {object} config Original webpack config.
 * @param {object} env Options passed to CLI.
 * @param {WebpackConfigHelpers} helpers Object with useful helpers when working with config.
 **/
export default function(config, env, helpers) {
  config.module.loaders.push({
    enforce: 'pre',
    test: /\.tsx?$/,
    loader: 'ts-loader'
  })

  config.resolve.alias['preact-cli-entrypoint'] = resolve(process.cwd(), 'src', 'index')
}
