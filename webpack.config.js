const autoprefixer = require('autoprefixer')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')

// =========================================================
//  ENVIRONMENT VARS
// ---------------------------------------------------------
const NODE_ENV = process.env.NODE_ENV

const ENV_DEVELOPMENT = NODE_ENV === 'development'
const ENV_PRODUCTION = NODE_ENV === 'production'
const ENV_TEST = NODE_ENV === 'test'

const HOST = process.env.HOST || 'localhost'
const PORT = process.env.PORT || 3000

// =========================================================
//  LOADERS
// ---------------------------------------------------------
const loaders = {
  js: {test: /\.js$/, exclude: /node_modules/, loader: 'babel'},
  scss: {test: /\.scss$/, loader: 'style!css!postcss!sass'},
}

// =========================================================
//  CONFIG
// ---------------------------------------------------------
const config = {}
module.exports = config

config.resolve = {
  extensions: ['', '.ts', '.js'],
  modulesDirectories: ['node_modules'],
  root: path.resolve('.'),
}

config.plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
  }),
]

config.postcss = [
  autoprefixer({ browsers: ['last 3 versions'] }),
]

config.sassLoader = {
  outputStyle: 'compressed',
  precision: 10,
  sourceComments: false,
}

// =====================================
//  DEVELOPMENT or PRODUCTION
// -------------------------------------
if (ENV_DEVELOPMENT || ENV_PRODUCTION) {
  config.devtool = 'source-map'

  config.entry = {
    main: [
      './src/main',
    ],
    vendor: [
      'urijs',
      'whatwg-fetch',
      'babel-polyfill',
      'classnames',
      'firebase',
      'history',
      'react',
      'react-dom',
      'react-router',
      'bootstrap-loader',
    ],
  }

  config.output = {
    filename: '[name].js',
    path: path.resolve('./dist'),
    publicPath: '/',
  }

  config.plugins.push(
    new webpack.optimize.CommonsChunkPlugin('vendor', '[name].js'),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      favicon: './src/favicon.ico',
      hash: true,
      inject: 'body',
      template: './src/index.html',
    })
  )
}

// =====================================
//  DEVELOPMENT
// -------------------------------------
if (ENV_DEVELOPMENT) {
  config.entry.main.unshift(
    `webpack-dev-server/client?http://${HOST}:${PORT}`,
    'webpack/hot/dev-server'
  )

  config.module = {
    preLoaders: [
      {test: /\.js$/, loader: 'eslint-loader', exclude: /node_modules/},
    ],
    loaders: [
      loaders.scss,
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel', query: {
        plugins: [
          [
            'react-transform',
            {transforms: [ {transform: 'react-transform-hmr', imports: ['react'], locals: ['module']} ]},
          ],
        ],
      }},
      { test: /\.(woff2?|svg)$/, loader: 'url?limit=10000' },
      { test: /\.(ttf|eot)$/, loader: 'file' },
      { test: /\.(jpe?g|png|gif|svg|ico)$/, loader: 'url?limit=10000' },

      { test: require.resolve('jquery'), loader: 'expose?jQuery' },
      { test: require.resolve('jquery'), loader: 'expose?$' },

      // Bootstrap 3
      { test: /bootstrap-sass\/assets\/javascripts\//, loader: 'imports?jQuery=jquery' },
    ],
  }

  config.plugins.push(
    new webpack.HotModuleReplacementPlugin()
  )

  config.devServer = {
    contentBase: './src',
    historyApiFallback: true,
    host: HOST,
    hot: true,
    port: PORT,
    publicPath: config.output.publicPath,
    stats: {
      cached: true,
      cachedAssets: true,
      chunks: true,
      chunkModules: false,
      colors: true,
      hash: false,
      reasons: true,
      timings: true,
      version: false,
    },
  }
}

// =====================================
//  PRODUCTION
// -------------------------------------
if (ENV_PRODUCTION) {
  config.module = {
    loaders: [
      loaders.js,
      {test: /\.scss$/, loader: ExtractTextPlugin.extract('css?-autoprefixer!postcss!sass')},

      { test: /\.(woff2?|svg)$/, loader: 'url?limit=10000' },
      { test: /\.(ttf|eot)$/, loader: 'file' },
      { test: /\.(jpe?g|png|gif|svg|ico)$/, loader: 'url?limit=10000' },

      { test: require.resolve('jquery'), loader: 'expose?jQuery' },
      { test: require.resolve('jquery'), loader: 'expose?$' },

      // Bootstrap 3
      { test: /bootstrap-sass\/assets\/javascripts\//, loader: 'imports?jQuery=jquery' },
    ],
  }

  config.plugins.push(
    new ExtractTextPlugin('styles.css'),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      compress: {
        dead_code: true, // eslint-disable-line camelcase
        screw_ie8: true, // eslint-disable-line camelcase
        unused: true,
        warnings: false,
      },
    })
  )
}

// =====================================
//  TEST
// -------------------------------------
if (ENV_TEST) {
  config.devtool = 'inline-source-map'

  config.module = {
    loaders: [
      loaders.js,
      loaders.scss,
    ],
  }
}
