const fs = require("fs");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FileManagerPlugin = require("filemanager-webpack-plugin");
const SimpleProgressWebpackPlugin = require("simple-progress-webpack-plugin");
const { DefinePlugin } = require("webpack");
const router = require("./router");
const paths = require("./webpack.paths");

const pages = router.map(config => ({
    ...config,
    keyName: config.source.replace(/\//g, "sl").replace(/-/g, ""),
    component: fs.readFileSync(`${paths.pages}${config.source}/index.ts`).toString().match(/@customElement\("([^"]+)"\)/)[1],
}));

for (let i = 0; i < pages.length; i++)
    pages[i].outputPath = pages[i].outputPath === undefined ? pages[i].source : pages[i].outputPath;

const config = {
    entry: Object.fromEntries(pages.map(page => [page.keyName, `${paths.pages}${page.source}/index.ts`])),

    output: {
        path: `${paths.build}`,
        filename: "bundles/[name].[contenthash].js",
    },

    plugins: [
        ...pages.map(page => new HtmlWebpackPlugin({
            template: `${paths.pages}/base.html`,
            templateParameters: {
                title: page.title,
                description: page.description,
                component: `<${page.component}></${page.component}>`,
            },
            filename: `.${page.outputPath}/index.html`,
            chunks: [page.keyName],
        })),
        new DefinePlugin({
            PRODUCTION: process.env.NODE_ENV.startsWith("production"),
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
        }),
        new FileManagerPlugin({
            runTasksInSeries: true,
            events: {
                onStart: {
                    delete: [`${paths.build}/`],
                    mkdir: [`${paths.build}/`],
                },
                onEnd: {
                    copy: [
                        { source: `${paths.src}/assets/to-root`, destination: `${paths.build}/` },
                    ],
                },
            },
        }),
    ],

    module: {
        rules: [{
            test: /\.(ts|tsx)$/,
            use: [{
                loader: "esbuild-loader",
                options: {
                    loader: "ts",
                    target: "es6",
                },
            }],
        }, {
            test: /.(scss|css)$/,
            use: [
                { loader: "lit-css-loader" },
                { loader: "sass-loader" },
            ],
        }, {
            test: /\.(png|svg|jpg|jpeg|gif)$/,
            type: "asset/resource",
        }],
    },

    resolve: {
        extensions: [".tsx", ".ts", ".js", ".css", ".scss"],
        plugins: [new TsconfigPathsPlugin()],
    },
};

// This plugin brakes stats.json
if (!process.env.NODE_ENV.endsWith("stats"))
    config.plugins.push(new SimpleProgressWebpackPlugin());

module.exports = config;
