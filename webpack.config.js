// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3000,
};

const webpack = require('webpack');
const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');

const fileExtensions = [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'eot',
    'otf',
    'svg',
    'ttf',
    'woff',
    'woff2',
];

const options = {
    mode: process.env.NODE_ENV || 'development',
    entry: {
        background: path.join(__dirname, 'src', 'pages', 'Background', 'index.js'),
        options: path.join(__dirname, 'src', 'pages', 'Options', 'index.jsx'),
        popup: path.join(__dirname, 'src', 'pages', 'Popup', 'index.jsx'),
        contentScripts: path.join(__dirname, 'src', 'contentScripts.js'),
    },
    output: {
        path: path.join(__dirname, 'build'),
        filename: '[name].bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader',
                exclude: /node_modules/,
            },
            {
                test: new RegExp('.(' + fileExtensions.join('|') + ')$'),
                loader: 'file-loader?name=[name].[ext]',
                exclude: /node_modules/,
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        alias: {
            'react-dom': '@hot-loader/react-dom',
        },
        extensions: fileExtensions
            .map((extension) => '.' + extension)
            .concat(['.jsx', '.js', '.css']),
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new CleanWebpackPlugin({ // clean the build folder
            verbose: true
        }),
        new webpack.EnvironmentPlugin(['NODE_ENV']),    // expose and write the allowed env vars on the compiled bundle
        new CopyWebpackPlugin(
            [
                {
                    force: true,
                    from: 'src/manifest.json',
                    to: path.join(__dirname, 'build'),
                    transform: content => Buffer.from(
                        JSON.stringify({
                            description: process.env.npm_package_description,
                            version: process.env.npm_package_version,
                            ...JSON.parse(content.toString()),
                        })
                    ),
                },
            ],
            {
                logLevel: 'info',
                copyUnmodified: true,
            }
        ),
        new HtmlWebpackPlugin({
            chunks: ['options'],
            filename: 'options.html',
            template: path.join(__dirname, 'src', 'pages', 'template.html'),
        }),
        new HtmlWebpackPlugin({
            chunks: ['popup'],
            filename: 'popup.html',
            template: path.join(__dirname, 'src', 'pages', 'template.html'),
        }),
        new WriteFilePlugin(),
    ],
};

if (env.NODE_ENV === 'development') {
    options.devtool = 'cheap-module-eval-source-map';
}

module.exports = options;
