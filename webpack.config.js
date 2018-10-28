const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './example/index.js',
  mode: 'development',
  devtool: 'source-map',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    watchContentBase: true,
    open: true,
    noInfo: true,
    contentBase: [
      path.join(__dirname, 'example')
    ],
    compress: true,
    port: 8080
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'example/index.html',
      inject: true
    })
  ]
}
