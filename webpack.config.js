const path = require('path');
const nodeExternals = require('webpack-node-externals');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');

const {
  NODE_ENV = 'production',
} = process.env;
module.exports = {
  entry: './src/main.ts',
  mode: NODE_ENV,
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.js'
  },
  watch: NODE_ENV === 'development',
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
      new WebpackShellPlugin({
        onBuildEnd: ['yarn start:dev']
      })
    ],
    extensions: ['.ts', '.js'],
  },
  externals: [nodeExternals()]
}