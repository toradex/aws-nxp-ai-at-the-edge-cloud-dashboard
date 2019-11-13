import ZipPlugin from 'zip-webpack-plugin'

const stage = process.env.STAGE
const mode = (stage === 'staging' || stage === 'production') ? 'production' : 'development'
const isProd = mode === 'production'

module.exports = {
  mode,
  devtool: isProd ? false : 'source-map',
  target: 'node',
  output: {
    libraryTarget: 'commonjs2'
  },
  externals: ['aws-sdk'],
  module: {
    rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'stage-0'],
            plugins: ['package-name-import']
          }
        }
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|css)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]'
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'webpack-conditional-loader'
        }
      }
    ]
  },
  plugins: [
    new ZipPlugin({
      // pathPrefix: 'test',
    })
  ]
}
