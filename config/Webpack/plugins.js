const webpack = require("webpack");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin;

const packageInfo = require("../../package.json");

module.exports = ({ BUILD_DIR, OUTPUT_DIR, PRODUCTION, DEVELOPMENT }) => {
    const plugins = [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
            "process.env.CURRENT_VERSION": JSON.stringify(packageInfo.version),
            "process.env.DEVELOPMENT": JSON.stringify(DEVELOPMENT),
            "process.env.PRODUCTION": JSON.stringify(PRODUCTION),
            "process.env.WEBPACK_MODE": JSON.stringify(true)
        }),
        // ignore all except en/fr/de
        new webpack.ContextReplacementPlugin(
            /moment[\/\\]locale$/,
            /(en|de|fr)$/
        ),
        // extract css to file
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        // analyze bundle
        new BundleAnalyzerPlugin({
            // don't open the file automatically
            openAnalyzer: false,
            // default type to open (`stat`, `parsed` or `gzip`)
            defaultSizes: "parse",
            // create a server for the watcher or a static file for production enviroments
            analyzerMode: "static",
            // output outside of the public folder
            reportFilename: "../../webpack.report.html"
        })
    ];

    if (PRODUCTION) {
        // optimize js output using uglifyjs
        plugins.push(
            new UglifyJSPlugin({
                sourceMap: true,
                uglifyOptions: {
                    compress: {
                        inline: false
                    }
                }
            })
        );
        // cleanup old build files from BUILD
        plugins.push(
            new CleanWebpackPlugin([`${BUILD_DIR}/${OUTPUT_DIR}/*.*`], {
                root: `${__dirname}/../..`,
                exclude: [],
                verbose: false,
                dry: false
            })
        );
    } else {
        // development only plugins
    }

    return plugins;
};
