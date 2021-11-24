const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const fs = require('fs');

module.exports = (env) => {
	const variables = Variables(env);
	return {
		entry: './src/index.tsx',
		output: {
			filename: 'main.js',
			path: path.resolve(__dirname, 'dist'),
			publicPath: variables.root
		},
		devtool: env.NODE_ENV.includes('local') ? 'inline-source-map' : false,
		module: {
			rules: [
				{
					test: /\.(scss|css)$/,
					use: [ 'style-loader', 'css-loader' ]
				},
				{
					test: /\.tsx?$/,
					loader: 'ts-loader'
				},
				{
					test: /\.(scss|css|ts|tsx)$/,
					loader: 'string-replace-loader',
					options: {
						multiple: variables.keys
					}
				}
			]
		},
		devServer: {
			watchContentBase: true
		},
		resolve: {
			extensions: [ '.tsx', '.ts', '.js' ]
		},
		plugins: [
			new CleanWebpackPlugin(),
			new HtmlWebpackPlugin({
				template: './src/index.html'
			}),
			new CopyPlugin([ { from: './src/asset', to: '' } ])
		]
	};
};

function Variables(env) {
	const vpath = './configuration/' + env.NODE_ENV + '.json';
	console.log('ENV: ' + env.NODE_ENV);
	console.log('ENV PATH: ' + vpath);
	const variables = JSON.parse(fs.readFileSync(vpath));
	console.log('variables: ' + JSON.stringify(variables));
	return variables;
}
