const path = require('path');
const webpack = require('webpack');

module.exports = {
	mode: 'development', // production || none
	entry: {
		common: './js/common.js'
	},
	devtool: 'inline-source-map',
	devServer: {
		contentBase: './dist',
		hot: true
	},
	output: {
		path: path.resolve(__dirname, '../www/staic/js'),
		filename: '[name].js'
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin()
	],
	module: {
		rules: [
			{ 
				test: /\.styl/, 
				use: [
					'style-loader',
					'css-loader',
					'stylus-loader'
				]
			},
			{
				test: /\.js/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			}
		]
	}
};