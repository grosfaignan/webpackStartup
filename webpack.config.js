const HtmlWebpackPlugin = require('html-webpack-plugin');
// const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
// const manifest = require('./dist/manifest.json');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const pkg = require('./package.json');
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require('webpack');
const {WebpackManifestPlugin} = require('webpack-manifest-plugin');
const dev = process.env.NODE_ENV === "dev";




let config = {
  
  entry: {
    app:"./assets/js/app.js"
  },
  watch: dev,
  output: {
    path: path.resolve("./dist"),
    filename: "[name].[contenthash:8].js",
    publicPath: "../dist/",
    // jsonpFunction: 'webpackJsonpMyApp'
    // asyncChunks: true,
    clean: true,
  },
  plugins: [
    new webpack.BannerPlugin({
      banner:
      `${pkg.name} Version: ${pkg.version}\nAuthor : ${pkg.author}\n${pkg.authorInfo.name}\n${pkg.authorInfo.email}\n${pkg.authorInfo.company}\n${pkg.authorInfo.website}\nCopyright(c) ${new Date()}.\nAll right reserved.
    `}),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
      // chunkFilename: '[id].css',
    }),
    new WebpackManifestPlugin({
    }),
    new HtmlWebpackPlugin({
      title: 'Main Page',
      template: './index.html',
      // chunks: ['app.js', 'vendors'], // ajoute les chunks "main" et "vendors"
      filename: 'index.html',
      inject:true,
      minify:dev?false:true,
    }),
    // new HtmlWebpackTagsPlugin({
    //   append: false, //mettre a true pour que les insert se fasse "after" les balises déja existante dans la page html
    //   links: '.'+ manifest['app.css'],
    //   scripts:'.'+ manifest['app.js'],
    //   files:['page1.html]
    // })
    
  ],
  devtool: dev ? "eval-cheap-source-map" : false,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: ["babel-loader"],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name].[hash:8][ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/automatic',
        generator: {
          filename: '/fonts/[hash][ext][query]'
        },
        use: [
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true, // webpack@1.x
              disable: true, // webpack@2.x and newer
              webp:{
                quality:75
              }
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: dev? "style-loader":MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: { importLoaders: 1 },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins:[
                  require('autoprefixer')({
                    overrideBrowserslist:['last 10 versions']
                  }),
                  require('cssnano')({
                    preset:"default",
                    math:"strict-legacy",
                  })
                ]
              },
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: dev? "style-loader":MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: { importLoaders: 1 },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins:[
                  require('autoprefixer')({
                    overrideBrowserslist:['last 10 versions']
                  }),
                  require('cssnano')({
                    preset:"default",
                    math:"strict-legacy",
                  })
                ]
              },
            },
          },
          "less-loader",
        ],
      },
    ],
  },
  //   externals: {
  //     jquery: "jQuery",
  //   },
  optimization: {
    minimize: dev ? false : true,
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        terserOptions: {
          compress: {
            drop_console: true,
            warnings: false,
          },
          mangle: {
            toplevel: true,
            //   properties:true,
          },
          format: {
            comments: false,
          },
          sourceMap: true,
        },
      }),
    ],
  },
  
};

module.exports = config;

