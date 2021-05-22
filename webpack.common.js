const paths = require('./webpack.paths');
const fs = require('fs');
const webpack = require('webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FileManagerPlugin = require("filemanager-webpack-plugin");
const HtmlReplaceWebpackPlugin = require("@zipeapps/html-replace-webpack-plugin");

const pages = fs.readdirSync(paths.pages);
const localesPaths = fs.readdirSync(paths.locales);

const defaultLocaleCode = "en";
const localesNames = localesPaths.map(localePath => localePath.split(".locale.")[0]);
const locales = new Map(localesPaths.map((localePath, index) =>
	[localesNames[index], new Map(JSON.parse(fs.readFileSync(`${paths.locales}/${localePath}`)))]));

const pagesAndLocales = [];
pages.forEach(page => localesNames.forEach(locale => pagesAndLocales.push({page: page, locale: locale})));

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
		new MiniCssExtractPlugin({filename: '[name]/style.css'}),
		...pagesAndLocales.map(({page, locale}) => new HtmlWebpackPlugin({
			template: `${paths.pages}/${page}/page.html`,
			filename: locale === defaultLocaleCode ? (page === "root" ? "./index.html" : `./${page}/index.html`)
				: (page === "root" ? `./${locale}/index.html` : `./${locale}/${page}/index.html`),
			chunks: [page],
			meta: {
				charset: "utf-8",
				viewport: "width=device-width, initial-scale=1.0"
			}
		})),
		new HtmlReplaceWebpackPlugin([{
			pattern: "<html lang=\"\">",
			replacement: function (match, file, groups) {
				const fileRegex = file.match(/\.\/(.{2})\/(.+\/)*index\.html/);
				return `<html lang="${fileRegex ? fileRegex[1] : defaultLocaleCode}">`;
			}
		}, {
			pattern: /\$\$link-locale\$\$/g,
			replacement: function (match, file, groups) {
				const fileRegex = file.match(/\.\/(.{2})\/(.+\/)*index\.html/);
				return fileRegex ? `/${fileRegex[1]}` : "";
			}
		}, {
			pattern: /\$\$([\w-]+)\$\$/g,
			replacement: function (match, file, groups) {
				const fileRegex = file.match(/\.\/(.{2})\/(.+\/)*index\.html/);
				return locales.get(fileRegex ? fileRegex[1] : defaultLocaleCode).get(groups[0]);
			}
		}]),
		new FileManagerPlugin({
			runTasksInSeries: true,
			events: {
				onStart: {
					delete: [`${paths.dist}/`],
					mkdir: [`${paths.dist}/`]
				},
				onEnd: {
					copy: [
						{source: `${paths.src}/assets/to-root`, destination: `${paths.dist}/`}
					]
				}
			}
		})
	],

	module: {
		rules: [{
			test: /\.(ts|tsx)$/,
			loader: 'ts-loader',
			include: [paths.src],
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
		}, {
			test: /\.(png|svg|jpg|jpeg|gif)$/,
			type: 'asset/resource',
		}]
	},

	resolve: {
		extensions: ['.tsx', '.ts', '.js', '.css', '.scss'],
		plugins: [new TsconfigPathsPlugin()]
	}
};