const paths = require("./webpack.paths");
const fs = require("fs");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FileManagerPlugin = require("filemanager-webpack-plugin");
const SimpleProgressWebpackPlugin = require("simple-progress-webpack-plugin");
const router = require("./router");

const pages = router.map(config => { return {
	...config,
	keyName: config.source.replace(/\//g, 'sl').replace(/-/g, ''),
	component: fs.readFileSync(`${paths.pages}${config.source}/index.ts`).toString().match(/@customElement\("([^"]+)"\)/)[1],
}});

for (let i = 0; i < pages.length; i++)
	pages[i].outputPath = pages[i].outputPath === undefined ? pages[i].source : pages[i].outputPath;

const config = {
	entry: Object.fromEntries(pages.map(page => [ page.keyName, `${paths.pages}${page.source}/index.ts` ])),

	output: {
		path: `${paths.dist}`,

		filename: (pathData) => {
			const page = pages.find(page => page.keyName === pathData.chunk.name);
			if (!page) return "[contenthash].bundle.js";
			return `${page.outputPath.substring(1)}/script.js`;
		}
	},

	plugins: [
		new SimpleProgressWebpackPlugin(),
		...pages.map(page => new HtmlWebpackPlugin({
			template: `${paths.pages}/base.html`,
			templateParameters: {
				title: page.title,
				description: page.description,
				component: `<${page.component}></${page.component}>`
			},
			filename: `.${page.outputPath}/index.html`,
			chunks: [page.keyName]
		})),
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
			use: [{
				loader: 'esbuild-loader',
				options: {
					loader: "ts",
					target: "es6"
				}
			}]
		}, {
			test: /.(scss|css)$/,
			use: [
				{ loader: "lit-css-loader" },
				{ loader: "sass-loader" }
			]
		}, {
			test: /\.(png|svg|jpg|jpeg|gif)$/,
			type: "asset/resource",
		}]
	},

	resolve: {
		extensions: [".tsx", ".ts", ".js", ".css", ".scss"],
		plugins: [new TsconfigPathsPlugin()]
	}
};

module.exports = config;
