const path = require('path');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = env => {

  return {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    mode: env.NODE_ENV,
    devServer: {
           contentBase: './dist',
    },
    module: {
      rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
            {
             test: /\.css$/,
             use: [
              'style-loader',
              'css-loader',
              ],
           },
          {
              test: /\.(png|svg|jpg|gif)$/,
              use: [
                'file-loader',
              ],
            },
          ],
      },
      plugins: [
        /* Use the ProvidePlugin constructor to inject jquery implicit globals */
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery'",
            "window.$": "jquery"
        }),
        new webpack.DefinePlugin({
          APIURL: JSON.stringify(env.APIURL),
          'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV)
        }),
        new CompressionPlugin({
          test: /\.js(\?.*)?$/i,
          cache: true
        })
      ]
  }
};