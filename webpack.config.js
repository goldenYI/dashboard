"use strict"
var webpack = require("webpack");
var path= require("path")
const glob = require('glob');

var config = {
    entry: {
        vendor: [
            'react',
            'react-dom'
        ]
    },
    output: {
        path: __dirname + '/dist/js/',
        filename: 'index.js'
    },
    resolve: {
        root: [
            path.resolve('./src'),
            path.resolve('./src/js'),
            path.resolve('./dist')
        ]
    },
    module: {
        preLoaders: [{
            test: /\.js$/,
            loader: "eslint-loader",
            exclude: [/node_modules/, /dist/]
        }],
        loaders: [{
                test: /\.js$/,
                exclude: [/node_modules/, /dist/],
                loader: 'babel',
                query: {
                    presets: ['es2015', 'stage-0', 'react']
                }
            },{
               test: /\.css$/,
               exclude: /node_modules/,
               loader: "style-loader!css-loader?modules&root=./dist",
           },{
　　　　　　      test: /\.((woff2?|svg)(\?v=[0-9]\.[0-9]\.[0-9]))|(woff2?|svg|jpe?g|png|gif|ico)$/,
　　　　　　      loader: 'url-loader?limit=8192&name=../assets/images/[hash:8].[name].[ext]'
　　　　    }
        ]
    },
    eslint: {
        configFile: './.eslintrc'
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js')
    ]
};

/**
 * find entries
 */
var files = glob.sync('./src/js/index.js');
var newEntries = files.reduce(function(memo, file) {
    var name = /.*\/(.*?)\/index\.js/.exec(file)[1];
    memo[name] = entry(name);
    return memo;
}, {});

config.entry = Object.assign({}, config.entry, newEntries);

/**
 * [entry description]
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
function entry(name) {
    return './src/' + name + '/index.js';
}

module.exports = config;
