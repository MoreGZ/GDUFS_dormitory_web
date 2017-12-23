const glob = require("glob");
const path = require("path");

var getEntries = function(globalPath){
	var entries1 = {};
	var entry,key,val;
	var files = glob.sync(globalPath);
	console.log(files.length);
	for(var i=0;i<files.length;i++){
		entry = files[i];

		key = path.basename(entry).split(".")[0];
		val = path.resolve(entry);

		entries1[key] = val;
	}
	return entries1;
}

var entries = getEntries('./src/*/js/*.main.js');
entries['vendor'] = ['jquery','vue'];

var webpackBaseConf = {
	entry:entries,
	output:{
		path:path.resolve(__dirname, '../dist'),
		filename:"js/[name].[hash].main.js",
		publicPath:'./'
	},
	devtool:'eval-source-map',
	module:{
		loaders:[
			// {
			// 	test:/\.css$/,
			// 	use:[
			// 		{
			// 			loader:'style-loader'
			// 		},{
			// 			loader:'css-loader'
			// 		}
			// 	]
			// },
			{
		        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff)(\?.*)?$/,
		        loader: 'url-loader?limit=1024&name=image/[name][hash:8].[ext]',
		        options: {
					limit: 10000,
					name: 'image/[name].[hash:7].[ext]'
		        }
			},
			{
				test:/\.html$/,
				loader:'html-withimg-loader'
			},
		]
	}
}
module.exports = webpackBaseConf;