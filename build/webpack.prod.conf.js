const webpackBaseConf = require("./webpack.base.conf.js");
const cleanWebpackPlugin = require("clean-webpack-plugin");
const uglifyJsPlugin = require("uglify-js-plugin");
const extractTextWebpackPlugin = require("extract-text-webpack-plugin");
const htmlWebpackPlugin = require('html-webpack-plugin');
const merge = require("webpack-merge");
const webpack = require("webpack");
const glob = require("glob");
const path = require("path");


const getTemps = function(globalPath){
	var temps = {};
	var entry,key,val;
	var files = glob.sync(globalPath);
	for(var i=0;i<files.length;i++){
		entry = files[i];

		key = path.basename(entry).split(".")[0];
		val = path.resolve(entry);

		temps[key] = val;
	}

	return temps;
}
var temp = getTemps('./src/*/*.temp.html');

let plugins = [
	new cleanWebpackPlugin(__dirname+'/dist'),
	// new uglifyJsPlugin(),
	new extractTextWebpackPlugin("css/[name].css"),
    new webpack.optimize.CommonsChunkPlugin({
		name: 'lib',
		chunks: ['vendor'],
		// filename:"xxx.js"
    })
];
for(var name in temp){
	plugins.push(new htmlWebpackPlugin({
		template:temp[name],
		filename:name+'.html',
		chunks:[name],
		// minify: {
		// 	removeComments: true,
		// 	collapseWhitespace: true,
		// 	removeAttributeQuotes: true
		// },
	}))
}
var webpackProdConf = merge(webpackBaseConf,{
	module:{
		loaders:[
			{
				test:/\.css$/,
				use:extractTextWebpackPlugin.extract({
					fallback:"style-loader",
					use:[
						{
							loader:"css-loader",
							options:{
								minimize: true,
							}
						}
					]
				})
			}
		    // {
		    //   test: /\.css$/, loader: extractTextWebpackPlugin.extract('style', 'css')
		    // }
		]
	},
	plugins:plugins
})

module.exports = webpackProdConf