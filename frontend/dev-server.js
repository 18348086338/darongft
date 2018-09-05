const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');

const config = require('./webpack.config.js');
const options = {
	contentBase: './dist',
	hot: true,
	host: '127.0.0.1',
	port: 3333
};

webpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
const server = new webpackDevServer(compiler, options);

server.listen(3333, '127.0.0.1', () => {
	console.log('dev server listening on port 3333');
});