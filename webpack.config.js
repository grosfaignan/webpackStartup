const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const pkg = require("./package.json");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");
const dev = process.env.NODE_ENV === "dev";
//je n'utilise pas webpack-maniçfest-plugin, a la place 
//j'injecte directement mes balise script/link depuis HtmlWebpackPlugin

let config = {
  mode:dev? 'development':'production',
  entry: {
    app: "./assets/js/app.js", //j'ai pas reussi a mettre plusieurs "entry"
  },
  watch: dev,
  output: {
    path: path.resolve("./dist"),
    filename: "[name].[contenthash:8].js",
    publicPath: "../dist/",
    clean: true, //on clean a chaque build mais visiblement ca clean pas les images
  },
  resolve: {
    alias: {
      "@css": path.resolve("./assets/css/"),
      "@js": path.resolve("./assets/js/"),
      //lorsqu'ont met en place le dev-server ca pose un probleme avec la resolution des chemin dans les fichiers générés
      "@img": path.resolve("./assets/images/"),
    },
  },
  plugins: [
    new webpack.BannerPlugin({
      //le copyright
      banner: `${pkg.name} Version: ${pkg.version}\nAuthor : ${pkg.author}\n${
        pkg.authorInfo.name
      }\n${pkg.authorInfo.email}\n${pkg.authorInfo.company}\n${
        pkg.authorInfo.website
      }\nCopyright(c) ${new Date()}.\nAll right reserved.
    `,
    }),
    //extraction des css dans des fichiers séparés
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash:8].css",
    }),
    // j'ai ajouté la génération du html afin d'avoir le index.html
    // généré dans mon dist et pret a l'emploi pour le déploiement
    // ici aussi dev-server semble avoir un probleme 
    // avec la résolution des chemin
    new HtmlWebpackPlugin({
      title: "Main Page",
      template: "./index.html",
      filename: "index.html",
      publicPath:'./',
      inject: true,
      minify: dev ? false : true,
    }),
    //le linter
    new ESLintPlugin()
  ],
  //les sources map
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
        type: "asset/resource",
        generator: {
          filename: "images/[name].[hash:8][ext]",
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/automatic",
        generator: {
          filename: "/fonts/[hash][ext][query]",
        },
        use: [
          {
            loader: "image-webpack-loader",
            options: {
              webp: {
                quality: 75,
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            //on charge le css directement en js en dev
            //ont extrait cc en fichier séparé en prod
            loader: dev ? "style-loader" : MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: { importLoaders: 1 }, 
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  require("autoprefixer")({
                    //options a vérifiées
                    overrideBrowserslist: ["last 10 versions"],
                  }),
                  //j'ai rajouté nano pour la minification, peut etre n'aurais-je pas dû
                  require("cssnano")({
                    //option a vérifiées
                    preset: "default",
                    math: "strict-legacy",
                  }),
                ],
              },
            },
          },
        ],
      },
      {
        //idem que pour css avec le loader less en debut
        //joindre les test /\.css$/, /\.less$/ etc en une seule commande
        // avec une condition pour le loader initial si less/saas/etc...
        test: /\.less$/,
        use: [
          {
            loader: dev ? "style-loader" : MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: { importLoaders: 1 },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  require("autoprefixer")({
                    overrideBrowserslist: ["last 10 versions"],
                  }),
                  require("cssnano")({
                    preset: "default",
                    math: "strict-legacy",
                  }),
                ],
              },
            },
          },
          "less-loader",
        ],
      },
    ],
  },
  optimization: {
    //ont minimize qu'en prod
    minimize: dev ? false : true,
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        terserOptions: {
          //options a vérifier
          compress: {
            drop_console: true,
            warnings: false,
          },
          mangle: {
            toplevel: true,
          },
          format: {
            comments: false,
          },
          //a virer ?
          sourceMap: false,
        },
      }),
    ],
  },
};

module.exports = config;
