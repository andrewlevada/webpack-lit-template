const paths = require('./webpack.paths');
const fs = require('fs');
const webpack = require('webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FileManagerPlugin = require("filemanager-webpack-plugin");

const pages = fs.readdirSync(paths.pages);

// noinspection WebpackConfigHighlighting
module.exports = {

	// Create an entry for each html page
	// Entry name will be the path part of url
	entry: {
		test: './src/pages/test/script.ts'
	},

	output: {
		filename: "[name]/script.js",
		path: `${paths.dist}`
	},

	plugins: [
		new webpack.ProgressPlugin(),
		new MiniCssExtractPlugin({ filename:'[name]/style.css' }),
		...pages.map(page => new HtmlWebpackPlugin({
			template: `${paths.pages}/${page}/page.html`,
			filename: page === "root" ? "./index.html" : `./${page}/index.html`,
			chunks: [ page ]
		})),
		new FileManagerPlugin({
			runTasksInSeries: true,
			events: {
				onStart: {
					delete: [ `${paths.dist}/` ],
					mkdir: [ `${paths.dist}/` ]
				},
				onEnd: {
					copy: [
						{ source: `${paths.src}/assets/img`, destination: `${paths.dist}/static/img` },
						{ source: `${paths.src}/assets/to-root`, destination: `${paths.dist}/` }
					]
				}
			}
		})
	],

	module: {
		rules: [{
			test: /\.(ts|tsx)$/,
			loader: 'ts-loader',
			include: [ paths.src ],
			exclude: [/node_modules/]
		}, {
			test: /.(scss|css)$/,

			use: [
				{
					loader: MiniCssExtractPlugin.loader,
					options: {
						esModule: false,
					},
				}, {
					loader: "css-loader",
					options: {
						modules: "global"
					}
				}, {
					loader: "sass-loader",
			}]
		}]
	},

	resolve: {
		extensions: ['.tsx', '.ts', '.js', '.css', '.scss'],
		plugins: [ new TsconfigPathsPlugin() ]
	}
};