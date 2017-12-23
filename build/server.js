var config = require("./webpack.dev.conf.js");
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

config.entry.unshift("webpack-dev-server/client");

var compiler = webpack(config);
var server = new WebpackDevServer(compiler, {
    publicPath: config.output.publicPath,
    stats: {
        colors: true
    }
});

server.get = {
    targer: 'localhost:3000',
    secure: false
}
server.listen(8081);