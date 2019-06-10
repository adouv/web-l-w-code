'use strict';

// Modules
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
const fs = require('fs');

var ENV = process.env.npm_lifecycle_event;
var isCompile = ENV === 'form';

var BASE_PATH = './lwbdp-purchase';
let FORMS_JS = '/formsjs';
let FORMS = '/forms';

const files = fs.readdirSync(BASE_PATH + FORMS_JS);
const entryFiles = {};
files.forEach(function (file, i) {
    let formFile = null;
    if (file.lastIndexOf('.js') > -1) {
        formFile = file.substring(0, file.length - 3);
    }
    entryFiles[formFile] = BASE_PATH + FORMS_JS + '/' + file
});
module.exports = function makeWebpackConfig() {

    var config = {};

    config.entry = entryFiles;

    config.output = {
        path: __dirname + '/dist',
        filename: "[name].js"
    };

    config.module = {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            loader: ['style-loader', 'css-loader']
        }, {
            test: /\.(png|jpg|jpeg|gif|cur)$/,
            loader: 'file-loader?limit=8192&name=images/[hash].[ext]'
        }, {
            test: /\.(svg|woff|woff2|ttf|eot)$/,
            loader: 'file-loader?limit=8192&name=fonts/[hash].[ext]'
        }, {
            test: /\.(html|form)$/,
            loader: 'raw-loader'
        }]
    };

    config.plugins = [
        new webpack.optimize.UglifyJsPlugin({
            output: {
                comments: false
            },
            compress: {
                warnings: false
            }
        })
    ];
    return config;
}();