// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const WebpackDevServer = require('webpack-dev-server'),
  webpack = require('webpack'),
  config = require('../webpack.config'),
  env = require('./env'),
  path = require('path');

const options = config.chromeExtensionBoilerplate || {};
const excludeEntriesToHotReload = options.notHotReload || [];

for (const entryName in config.entry) {
  if (excludeEntriesToHotReload.indexOf(entryName) === -1) {
    config.entry[entryName] = [
      'webpack-dev-server/client?http://localhost:' + env.PORT,
      'webpack/hot/dev-server',
    ].concat(config.entry[entryName]);
  }
}

config.plugins = [new webpack.HotModuleReplacementPlugin()].concat(
  config.plugins || []
);

delete config.chromeExtensionBoilerplate;

new WebpackDevServer(webpack(config), {
  hot: true,
  contentBase: path.join(__dirname, '../build'),
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
  disableHostCheck: true,
}).listen(env.PORT);
