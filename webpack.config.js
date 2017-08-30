const path    = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
     module : {   
        rules : [
            {
                test: /\.js?$/,
                use: [
                    "ng-annotate-loader",
                    "babel-loader"
                ],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader?-minimize"
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader?-minimize"
                    },
                    {
                        loader: "sass-loader"
                    }
                ]
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: "file-loader?name=font/[folder][name].[ext]?mimetype=image/svg+xml"
            },
            {
                test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                loader: "file-loader?name=font/[folder][name].[ext]?mimetype=application/font-woff"
            },
            {
                test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                loader: "file-loader?name=font/[folder][name].[ext]?mimetype=application/font-woff"
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: "file-loader?name=font/[folder][name].[ext]?mimetype=application/octet-stream"
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: "file-loader?name=font/[folder][name].[ext]"
            },
            {
                test: /\.otf(\?v=\d+\.\d+\.\d+)?$/,
                loader: "file-loader?name=font/[folder][name].[ext]"
            },
            {
                test: /\.html$/,
                loader: 'html-loader?'+ JSON.stringify({attrs: ["img:src", "img:ng-src"]})
            },
            {
                test: /\.(jpe?g|png|gif)$/i,
                use: 
                [
                    {
                        loader: "url-loader",
                        options : {
                            limit: 100,
                            name: 'img/[name]-[sha512:hash:base64:7].[ext]'
                        }
                    }
                ],
                exclude: /favicon/
            },
            {
                test: /favicon/,
                loader: "file-loader?name=img/[name]-[hash].[ext]"
            }
        ]
    },
    plugins: [
    // Injects bundles in your index.html instead of wiring all manually.
    // It also adds hash to all injected assets so we don't have problems
    // with cache purging during deployment.
    new HtmlWebpackPlugin({
      template: 'client/index.html',
      inject: 'body'
    }),

    // Automatically move all modules defined outside of application directory to vendor bundle.
    // If you are using more complicated project structure, consider to specify common chunks manually.
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        return module.resource && module.resource.indexOf(path.resolve(__dirname, 'client')) === -1;
      }
    }),
    // new BundleAnalyzerPlugin()
  ]
};
