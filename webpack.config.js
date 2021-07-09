/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
//const PreactRefreshPlugin = require('@prefresh/webpack');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const dev = process.env.NODE_ENV !== 'production';
const plugins = [];

plugins.push(
  new WebpackManifestPlugin({
    fileName: '../manifest.json',
  })
);

plugins.push(
  new HtmlWebpackPlugin({
    title: 'Motorhome Wizard Demo',
    filename: 'demo.html',
    chunks: ['client', 'demo'],
    template: 'src/demo.ejs',
  })
);

plugins.push(
  new webpack.DefinePlugin({
    'process.env.VERSION': JSON.stringify((process.env.VERSION || 'unknown').substr(0, 7)),
  })
);

if (dev) {
  //plugins.push(new PreactRefreshPlugin());
}

plugins.push(
  new MiniCssExtractPlugin({
    filename: 'client/[name].[contenthash].css',
  })
);

const config = {
  mode: dev ? 'development' : 'production',
  devtool: dev ? 'eval' : 'nosources-source-map',
  devServer: {
    contentBase: './dist',
    hot: true,
    port: 3201,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  optimization: {
    moduleIds: 'deterministic',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.scss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'client/[name].[contenthash][ext][query]',
        },
      },
      {
        test: /\.travelhome\.graphql$/,
        use: [
          {
            loader: 'webpack-graphql-loader',
            options: {
              validate: true,
              schema: 'src/api/travelhome.schema.json',
              removeUnusedFragments: true,
              minify: !dev,
              output: 'string',
              emitDefaultExport: true,
            },
          },
        ],
      },
    ],
  },
};

const serverConfig = {
  ...config,
  target: 'node',
  entry: {
    server: './src/server.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: false,
    publicPath: '/',
  },
};

module.exports = serverConfig;
