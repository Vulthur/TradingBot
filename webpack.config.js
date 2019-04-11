const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    target: 'web',
    devtool: 'inline-source-map',
    entry: "./src/client/client.ts",
    output: {
        path: path.resolve(__dirname, 'dist/client/'),
        filename: './client.js'
    },
    resolve: {
        alias: {
            vue$: 'vue/dist/vue.esm.js',
        },
        extensions: [".ts", ".vue", ".json", ".js"],
    },
    module: {
        rules: [{
            test: /\.ts?$/, 
            loader: "ts-loader",
            options: { 
                onlyCompileBundledFiles: true,
                appendTsSuffixTo: [/\.vue$/],
                configFile: "tsconfig-client.json"
            }
        }, {
            test: /\.vue$/,
            loader: 'vue-loader',
        },
        {
            test: /\.css$/,
            use: [
                'vue-style-loader',
                'css-loader'
            ]
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/client/index.html",
            title: "TradingBot"
        }),
        new CleanWebpackPlugin(['dist/client']),
        new VueLoaderPlugin(),
    ],
    mode: 'development',
    watchOptions: {
        ignored: ['src/server/*.*', 'node_modules']
    },
    optimization: {
        minimizer: [new UglifyJsPlugin()],
    },
}