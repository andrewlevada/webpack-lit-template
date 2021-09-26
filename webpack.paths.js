const path = require('path');

// noinspection WebpackConfigHighlighting
const paths = {
	src: path.join(__dirname, '/src'),
	dist: path.join(__dirname, '/dist'),
	nodeModules: path.resolve(__dirname, 'node_modules'),
	pages: path.join(__dirname, '/src/pages')
};

module.exports = paths;
