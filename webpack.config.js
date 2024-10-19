const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
	entry: './src/index.js',
	devServer: {
		static: path.resolve(__dirname, './'),
		port: 9000,
		historyApiFallback: true,
	},
	devtool: 'eval-source-map',
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Tia Transita',
			template: 'index.html',
		}),
		new NodePolyfillPlugin(),
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
			  test: /\.(?:js|mjs|cjs)$/,
			  exclude: /node_modules/,
			  use: {
				loader: 'babel-loader',
				options: {
				  presets: [
					[
						'@babel/preset-env',
					]
				  ],
				  cacheDirectory: true,
				}
			  }
			},
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
			"@data": path.resolve(__dirname, "src/data"),
			"@objects": path.resolve(__dirname, "src/objects"),
			"@scenes": path.resolve(__dirname, "src/scenes"),
			"@sprites": path.resolve(__dirname, "src/sprites"),
			"@plugins": path.resolve(__dirname, "src/plugins"),
			"@constants": path.resolve(__dirname, "src/constants"),
		}
	}
};
