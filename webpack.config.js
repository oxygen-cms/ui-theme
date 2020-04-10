const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ModernizrWebpackPlugin = require('modernizr-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: {
        main: './resources/js/app.js',
    },
    // watch: true,
    mode: process.env.NODE_ENV,
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'public')
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // fallback to style-loader in development
                    MiniCssExtractPlugin.loader,
                    // Translates CSS into CommonJS
                    { loader: 'css-loader' },
                    {
                        loader: 'postcss-loader',
                        options: {
                          sourceMap: true,
                          config: {
                            path: 'postcss.config.js'
                          }
                        }
                    },
                    // Compiles Sass to CSS
                    'sass-loader',
                ],
            },
            {
                test: /\.css$/i,
                use: [
                    // fallback to style-loader in development
                    MiniCssExtractPlugin.loader,
                    // Translates CSS into CommonJS
                    { loader: 'css-loader' }
                ]
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/',
                            publicPath: '../fonts/'
                        }
                    }
                ]
            }
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: 'css/[name].css',
            chunkFilename: 'css/[id].css',
        }),
        new CopyPlugin([
            { from: 'node_modules/ace-builds/src-min-noconflict', to: 'vendor/ace' },
            { from: 'node_modules/ckeditor4', to: 'vendor/ckeditor4' },
            { from: 'node_modules/CKEditor-ShowProtected-Plugin/showprotected/', to: 'vendor/ckeditor4/plugins/showprotected' }
        ]),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ]
};