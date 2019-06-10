let path = require('path');

let webpack = require('webpack');

let HtmlWebpackPlugin = require('html-webpack-plugin');

let ExtractTextPlugin = require('extract-text-webpack-plugin');

let CopyWebpackPlugin = require('copy-webpack-plugin');

let ZipPlugin = require('zip-webpack-plugin');

function getEnvArgv(name) {
    const args = JSON.parse(process.env.npm_config_argv).original;
    if (args[2]) {
        const index = args[2].indexOf('=');
        return args[2].substring(index + 1);
    }
    return 'localhost:4800'
}

const host = getEnvArgv('--framehost');
console.log(host)
module.exports = {
    entry: './src/scripts/app.entry.js',
    output: {
        path: path.resolve(__dirname, 'target'),
        filename: '[name].[hash].js'
    },
    module: {
        rules: [{
                test: /\.js$/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader'
                    }, {
                        loader: 'postcss-loader'
                    }]
                }),
            }, {
                test: /\.(png|jpg|jpeg|gif|cur)$/,
                loader: 'file-loader?limit=8192&name=images/[hash].[ext]'
            }, {
                test: /\.(svg|woff|woff2|ttf|eot)$/,
                loader: 'file-loader?limit=8192&name=fonts/[hash].[ext]'
            }, {
                test: /\.html$/,
                use: [{
                    loader: 'html-loader',
                    options: {
                        minimize: true
                    }
                }]
            }
        ]
    },
    devtool: 'eval-source-map',
    plugins: [
        // new webpack.optimize.UglifyJsPlugin({
        //     output: {
        //         comments: false
        //     },
        //     compress: {
        //         warnings: false
        //     }
        // }),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new CopyWebpackPlugin([{
            from: __dirname + "/src/assets",
            to: './assets'
        }]),
        new ExtractTextPlugin({
            filename: '[name].css',
            disable: false,
            allChunks: true
        }),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'vendor',
        // }),
        new webpack.DefinePlugin({
            FRAME_HOST: JSON.stringify(host)
        }),
        new webpack.HotModuleReplacementPlugin(),
        new ZipPlugin({
            filename: 'lwtpk-manager.zip'
        })
    ],
    devServer: {
        contentBase: './src',
        historyApiFallback: true,
        disableHostCheck: true,
        openPage: '/login',
        port: 8086,
        proxy: {
            "/lwtpk-web": "http://10.0.0.6:8080",
            "/lw-authz-server": "http://10.0.0.84:8084",
            "/lw-garden-server": "http://10.0.0.84:8083",
            "/lw-fileserver": "http://10.0.0.10:96"
        },
        host: '0.0.0.0'
    }
};