const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin')
const TerserPlugin = require("terser-webpack-plugin")

const path = require("path")

const join = (...paths) => path.join(__dirname, ...paths)

module.exports = (env, { mode }) => ({
    entry: {
        'assets/main': [
            join("assets", "js", "login.ts"),
            join("assets", "js", "logoutButton.ts"),
        ],
        'assets/apiDocs': join("assets", "js", "apiDocs.ts"),
        'assets/apiDocsStyles': join("assets", "scss", "api-docs", "main.scss"),
        'authServiceWorker': join("assets", "js", "auth", "authServiceWorker.ts")
    },
    output: {
        filename: "[name].js",
        path: join("static"),
        publicPath: "",
    },
    performance: {
        hints: false,
    },
    module: {
        rules: [
            {
                test: /\.(tsx|ts)?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            experimentalWatchApi: true,
                        }
                    }
                ]
            },
            {
                test: /\.(jsx|js)$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.(png|jpg|woff|woff2|ttf|eot|svg)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 8192,
                        },
                    },
                ],
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader",
                ]
            }
        ],
    },
    optimization: {
        splitChunks: {
            name: "vendor",
            minChunks: 2,
        },
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                extractComments: false,
            }),
        ],
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx', '.jsx'],
        plugins: [
            new TsconfigPathsPlugin({
                configFile: path.resolve(__dirname, './tsconfig.json')
            })
        ],
        symlinks: false,
        cacheWithContext: false,
        fallback: {
            "buffer": false,
            "stream": false
        }
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [
                'static/*.js',
                'static/**/*.js',
                'static/**/*.css'
            ],
            cleanAfterEveryBuildPatterns: [
                join("static/assets/apiDocsStyles.js")
            ],
            verbose: true,
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css",
        }),
    ],
})
