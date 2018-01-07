const webpack = require("webpack");
const webpackBaseConf = require("./webpack.base.conf.js");
const merge = require("webpack-merge");
const htmlWebpackPlugin = require('html-webpack-plugin');



var webpackDevConf = merge(webpackBaseConf, {
	entry:[
		'./build/dev_client',
		// 'webpack-hot-middleware/client',
		'./src/dormitory_imformation_b/js/dormitory_imformation_b.main.js'
	],
	output:{
		path: '/',
		publicPath: 'http://localhost:8081/',
		filename: 'bundle.js'
	},
	plugins:[
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),
		new htmlWebpackPlugin({
			template: './src/dormitory_imformation_b/dormitory_imformation_b.temp.html',
			filename:"index.html"
		}),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"development"'
        }),
	],
	module:{
		loaders:[
			{
				test:/\.css$/,
				use:[
					{
						loader:'style-loader'
					},{
						loader:'css-loader'
					}
				]
			}
		]
	}
})
module.exports = webpackDevConf;