const paths = require('./webpack.paths');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const FileManagerPlugin = require("filemanager-webpack-plugin");
const { DuplicatesPlugin } = require("inspectpack/plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");

module.exports = merge(common, {
	mode: 'production',

	output: {
		sourceMapFilename: "source-maps/[name].js.map"
	},

	plugins: [
		new FileManagerPlugin({
			events: {
				onEnd: {
					archive: [
						{ source: `${paths.dist}/`, destination: `${paths.dist}/build.zip` },
					]
				}
			}
		}),
		new DuplicatesPlugin(),
		new FaviconsWebpackPlugin({
			logo: `${paths.src}/assets/favicon.png`,
			favicons: { // Don't forget to add content here
				appName: "app name", 
				appDescription: null,
				developerName: "dev name",
				developerURL: null,
				lang: null,
				theme_color: "#000", 
				background: "#000" 
			}
		})
	],

	optimization: {
		minimize: true,

		minimizer: [
			`...`,
			new TerserPlugin({
				terserOptions: {
					format: {
						comments: false
					}
				},
				extractComments: false
			}),
			new CssMinimizerPlugin()
		],

		runtimeChunk: 'single'
	}
});