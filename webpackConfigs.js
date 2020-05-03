const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const distFolder = path.resolve(__dirname, '_webpackTempDistFolder');

function getConfigs(attrs = {}) {
    const env = (attrs && attrs.env) || 'production';
    const isProd = env === 'production';

    const commonConfig = {
        mode: env,
        devtool: isProd ? 'none' : 'inline-source-map',
        output: {
            path: distFolder,
            publicPath: attrs.publicPath || '',
            filename: isProd
                ? '[name].[contenthash].bundle.js'
                : '[name].bundle.js',
        },
        resolve: {
            extensions: ['.js', '.jsx', '.json'],
        },
        resolveLoader: {
            // For development when using `npm link`
            // so it first searchs for modules in __dirname/node_modules
            // before resolving to the default 'node_modules'
            modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            cwd: __dirname,
                            presets: [
                                '@babel/preset-env',
                                '@babel/preset-react',
                            ],
                        },
                    },
                },
                {
                    test: /\.css$/,
                    use: [
                        { loader: MiniCssExtractPlugin.loader },
                        {
                            loader: 'css-loader',
                            options: {
                                modules: {
                                    auto: true,
                                    localIdentName: isProd
                                        ? '[name]_[local]_[contenthash:8]'
                                        : '[name]_[local]',
                                },
                            },
                        },
                        'sass-loader',
                    ],
                },
                {
                    test: /\.(png|jpg|svg|gif)$/i,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                // To remove require('img.png').default
                                esModule: false,
                                name: isProd
                                    ? '[name].[contenthash].[ext]'
                                    : '[name].[ext]',
                            },
                        },
                    ],
                },
            ],
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: isProd ? '[name].[contenthash].css' : '[name].css',
                chunkFilename: '[id].css',
                ignoreOrder: false,
            }),
        ],
    };

    const serverConfig = {
        ...commonConfig,
        target: 'node',
        entry: {
            ...attrs.serverEntries,
        },
        output: {
            ...commonConfig.output,
            filename: '[name].bundle.js',
            libraryTarget: 'commonjs2',
        },
    };

    const clientConfig = {
        ...commonConfig,
        target: 'web',
        entry: {
            ...attrs.clientEntries,
        },
        optimization: {
            minimize: env === 'production',
            splitChunks: {
                chunks: 'all',
            },
        },
        output: {
            ...commonConfig.output,
            libraryTarget: undefined,
        },
    };

    return { serverConfig, clientConfig };
}

module.exports = getConfigs;
