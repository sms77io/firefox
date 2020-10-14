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
const buildPath = path.join(__dirname, 'build');

const pageTemplate = name => new HtmlWebpackPlugin({
    chunks: [name],
    filename: `${name}.html`,
    template: path.join(__dirname, 'src', 'pages', 'template.html'),
});

const fileExtensions = [
    'eot',
    'gif',
    'jpeg',
    'jpg',
    'otf',
    'png',
    'svg',
    'ttf',
    'woff',
    'woff2',
];

const options = {
    optimization: {
        minimize: false
    },
    mode: process.env.NODE_ENV || 'development',
    entry: {
        background: path.join(__dirname, 'src', 'pages', 'Background', 'index.js'),
        contentScripts: path.join(__dirname, 'src', 'contentScripts.js'),
        options: path.join(__dirname, 'src', 'pages', 'Options', 'index.jsx'),
        popup: path.join(__dirname, 'src', 'pages', 'Popup', 'index.jsx'),
    },
    output: {
        filename: '[name].bundle.js',
        path: buildPath,
    },
    module: {
        rules: [
            {
                exclude: /node_modules/,
                loader: 'style-loader!css-loader',
                test: /\.css$/,
            },
            {
                exclude: /node_modules/,
                loader: 'file-loader?name=[name].[ext]',
                test: new RegExp('.(' + fileExtensions.join('|') + ')$'),
            },
            {
                exclude: /node_modules/,
                loader: 'html-loader',
                test: /\.html$/,
            },
            {
                exclude: /node_modules/,
                loader: 'babel-loader',
                test: /\.(js|jsx)$/,
            },
        ],
    },
    resolve: {
        alias: {
            'react-dom': '@hot-loader/react-dom',
        },
        extensions: fileExtensions.map(ext => `.${ext}`).concat(['.jsx', '.js', '.css']),
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new CleanWebpackPlugin({verbose: true}),  // clean the build folder
        new webpack.EnvironmentPlugin(['NODE_ENV']),    // expose and write the allowed env vars on the compiled bundle
        new CopyWebpackPlugin({
            patterns: [
                {
                    force: true,
                    from: 'src/manifest.json',
                    to: buildPath,
                    transform: content => Buffer.from(
                        JSON.stringify({
                            description: process.env.npm_package_description,
                            version: process.env.npm_package_version,
                            ...JSON.parse(content.toString()),
                        })
                    ),
                },
                {from: 'src/_locales', to: `${buildPath}/_locales`},
            ]
        }),
        pageTemplate('options'),
        pageTemplate('popup'),
        new WriteFilePlugin(),
    ],
};

if (env.NODE_ENV === 'development') {
    options.devtool = 'cheap-module-eval-source-map';
}

module.exports = options;
