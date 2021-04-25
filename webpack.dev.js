const paths = require('./webpack.paths');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
	mode: 'development',

	devServer: {
		contentBase: paths.dist,
		stats: {
			children: false, // Hide children information
			maxModules: 0 // Set the maximum number of modules to be shown
		},
		compress: true,
		host: '0.0.0.0', // Not localhost to be able to connect from other device in local network
		port: 2797,
		hot: true
	}
});