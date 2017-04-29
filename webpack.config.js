const webpack = require("webpack");
const path = require('path');

const isProduction = process.argv.indexOf("-p") > -1
const isClassic = process.argv.indexOf("-d") > -1

// ----------------------------------------------------------------------------- PLUGINS

const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

// var OfflinePlugin = require('offline-plugin');

var plugins = [
	new webpack.DefinePlugin({ isProduction: isProduction }),
	new webpack.ProvidePlugin({
		dat: "dat",
		isMobile: "isMobile",
		THREE: "THREE",
		WAGNER: "WAGNER",
		FileSaver: "FileSaver",
		oui: "oui",
		Cookie: "Cookie"
	}),
	new webpack.LoaderOptionsPlugin({
		minimize: isProduction,
		debug: !isProduction
	}),
	new webpack.optimize.CommonsChunkPlugin({children: true, async: true})
]
if(isProduction){
	plugins.push(new webpack.optimize.OccurrenceOrderPlugin())
	plugins.push(new webpack.optimize.UglifyJsPlugin({comments:false, compress:{warnings: false} }))
	// plugins.push(new OfflinePlugin({}))
} else {
	if(!isClassic){
		plugins.push(new webpack.HotModuleReplacementPlugin())
	}else{
		plugins.push(new BrowserSyncPlugin({ host: 'localhost', port: 9000, server: { baseDir: ['build','static'] } }, { reload: true }))
	}
}

// ----------------------------------------------------------------------------- CONFIG

module.exports = {
	devtool: isProduction?false:'source-map',
	entry: ['babel-polyfill',__dirname+"/src/js/Preloader"],
	output: {
		path: __dirname+'/build/bin/',
		filename: 'bundle.js',
		chunkFilename: "[id].bundle.js",
		publicPath: isProduction?'./bin/':'/bin/'
	},
	module: {
		loaders: [
			{ test: /\.json$/, exclude:[/node_modules|vendors/], loader: 'json' },
			{ test: /\.(glsl|vs|fs)$/, exclude:[/node_modules|vendors/], loader: 'shader' },
			{ test: /\.jsx?$/, exclude:[/node_modules|vendors/], loader:'babel', query: {presets:['es2015-native-modules', 'stage-0']} },
		],
	},
	// glsl: {
	// 	chunkPath: path.resolve(__dirname,'src/glsl/chunks')
	// },
	resolve: {
		extensions:['.json','.js','.glsl','.vs','.fs'],
		modules: [
			path.resolve(__dirname,'src/js'),
			path.resolve(__dirname,'src/glsl'),
			path.resolve(__dirname,'node_modules'),
			path.resolve(__dirname,'static/vendors'),
		],
		alias: {
			dat: 		__dirname+'/static/vendors/'+"dat.gui.js",
			isMobile: 	__dirname+'/static/vendors/'+"isMobile.js",
			THREE: 		__dirname+'/static/vendors/'+"three.js",
			WAGNER: 	__dirname+'/static/vendors/'+"Wagner.js",
			FileSaver: 	__dirname+'/static/vendors/'+"FileSaver.js",
			oui: 	__dirname+'/static/vendors/'+"oui.js",
			Cookie: 	__dirname+'/static/vendors/'+"Cookie.js",
		}
	},
	devServer: {
		open:true,
		compress:true,
		contentBase: ['./static','./build'],
		port:9000,
		hot:true,
		inline:true,
		noInfo:false,
		stats: { colors: true }
	},
	plugins:plugins
};
