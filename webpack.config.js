const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: './src/index.js',
	devServer: {
		static: path.resolve(__dirname, './'),
		port: 9000,
		historyApiFallback: true,
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Tia Transita',
			template: 'index.html',
		}),
	],
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/',
		clean: true,
	},
	optimization: {
		runtimeChunk: 'single',
	},
	module: {
		rules: [
			{
				test: /\.(png|jpg|jpeg|gif|svg)$/,
				exclude: /[\\/]node_modules[\\/]/,
				type: 'asset/resource',
				generator: {
					filename: `[path][name].[ext]`,
				}
			},
		]
	},
	resolve: {
		alias: {
			"@config": path.resolve(__dirname, "src/config"),
			"@objects": path.resolve(__dirname, "src/objects"),
			"@scenes": path.resolve(__dirname, "src/scenes"),
			"@sprites": path.resolve(__dirname, "src/sprites"),
			"@plugins": path.resolve(__dirname, "src/plugins"),
			"@constants": path.resolve(__dirname, "src/constants"),
		}
	}
};
