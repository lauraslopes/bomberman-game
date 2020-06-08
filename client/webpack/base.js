const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");

module.exports = {
    entry: "./src/index.ts",
    mode: "development",
    devtool: 'inline-source-map',
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, '../dist'),
        sourceMapFilename: "bundle.js.map"
    },
    module: {
        rules: [
            {test: [/\.tsx?$/], use: "ts-loader"},
            {test: /\.js$/, use: "source-map-loader", enforce: "pre"},
            {test: [/\.vert$/, /\.frag$/], use: "raw-loader"},
            {test: /\.(gif|png|jpe?g|svg|xml)$/i, use: "file-loader"}
        ]
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    devServer: {
        port: 3030,
        open: true,
        //host: '0.0.0.0',
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                pathRewrite: {'^/api': ''}
            }
        }
    },
    plugins: [
        new CleanWebpackPlugin({
            root: path.resolve(__dirname, "../")
        }),
        new webpack.DefinePlugin({
            CANVAS_RENDERER: JSON.stringify(true),
            WEBGL_RENDERER: JSON.stringify(true)
        }),
        new HtmlWebpackPlugin({
            template: "./index.html"
        })
    ]
};
