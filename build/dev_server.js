const webpack = require("webpack");
const express = require("express");
const devMiddleWare = require("webpack-dev-middleware");
const hotMiddleware = require('webpack-hot-middleware');
const records = require("../records.json");
const searchResult = require("../search_result.json");
const counselors = require("../counselors.json");
const selectObject = require("../selectObject.json");
var webpackDevConf = require("./webpack.dev.conf.js");
var compiler = webpack(webpackDevConf);

var app = express();
app.set('views', './views')
app.set('view engine', 'ejs')

app.get('/', function(req, res){ 
  res.send('hello world'); 
  console.log('hello world');
});
app.get('/x', function(req, res){ 
  res.send('hello world'); 
  console.log('hello world');
});

var apiRoutes = express.Router();

apiRoutes.post("/aaaa",function(req,res){
	console.log(req.body);
	res.end("1");
});
apiRoutes.get("/bbbb",function(req,res){
	res.end(JSON.stringify(records));
});
apiRoutes.get("/cccc",function(req,res){
	res.end(JSON.stringify(searchResult));
});
apiRoutes.get("/dddd",function(req,res){
	res.end(JSON.stringify(counselors));
});
apiRoutes.post("/ffff",function(req,res){
	res.end(JSON.stringify(selectObject));
});
app.use("/api",apiRoutes);


// var router = express.Router()
// router.get('/', function (req, res, next) {
//   res.render('index', { message: 'Hey there!'});
// })
// app.use(router)


var dmw = devMiddleWare(compiler,{
	publicPath:webpackDevConf.output.publicPath,
	stats:{
		color:true
	}
})

var hmw = hotMiddleware(compiler,{
	log: false,
	heartbeat: 2000
})

compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hmw.publish({ action: 'reload' })
    cb()
  })
})

app.use(dmw);
app.use(hmw);
app.use(express.static('public'));
app.listen(8081,function(){
	console.log("Listening on 8081");
	var c = require('child_process');
	c.exec('start http://localhost:8081/index.html');
})