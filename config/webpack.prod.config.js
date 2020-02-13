const webpack = require('webpack');
const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  entry: './src/main.ts',
  mode: 'production',
  target: 'node',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          'ts-loader',
        ]
      }
    ]
  },
  resolve: {
    plugins: [
      new TsconfigPathsPlugin({ configFile: "./tsconfig.json" }),
    ],
    extensions: ['.ts', '.js'],
  }
}