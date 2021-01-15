const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FileManagerPlugin = require("filemanager-webpack-plugin");

const paths = {
	src: path.join(__dirname, '/src'),
	dist: path.join(__dirname, '/dist'),
	nodeModules: path.resolve(__dirname, 'node_modules'),
	pages: path.join(__dirname, '/src/pages')
};

const pages = fs.readdirSync(paths.pages);

module.exports = {
	mode: 'development',

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
			filename: `./${page}/index.html`,
			chunks: [ page ]
		})),
		new FileManagerPlugin({
			events: {
				onEnd: {
					copy: [
						{ source: `${paths.src}/assets/img`, destination: `${paths.dist}/static/img` },
						{ source: `${paths.src}/assets/to-root`, destination: `${paths.dist}/` }
					]
				},
			},
		}),
	],

	module: {
		rules: [{
			test: /\.(ts|tsx)$/,
			loader: 'ts-loader',
			include: [ paths.src ],
			exclude: [/node_modules/]
		}, {
			test: /.(scss|css)$/,

			use: [{
				loader: MiniCssExtractPlugin.loader
			}, {
				loader: "css-loader",
				options: {
					sourceMap: true
				}
				}, {
				loader: "sass-loader",
				options: {
					sourceMap: true
				}
			}]
		}]
	},

	resolve: {
		extensions: ['.tsx', '.ts', '.js', '.css', '.scss'],
		plugins: [ new TsconfigPathsPlugin() ]
	},

	devServer: {
		contentBase: paths.dist,
		stats: {
			children: false, // Hide children information
			maxModules: 0 // Set the maximum number of modules to be shown
		},
		compress: true,
		port: 2797,
		hot: true
	},

	optimization: {
		minimizer: [ new TerserPlugin() ],

		splitChunks: {
			cacheGroups: {
				vendors: {
					priority: -10,
					test: /[\\/]node_modules[\\/]/
				}
			},

			chunks: 'async',
			minChunks: 1,
			minSize: 30000,
			name: false
		}
	}
};