var path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './app/app.jsx',
    output: {
        path: __dirname,
        filename: './dist/bundle.js'
    },
    resolve: {
        alias: {
            Components: path.resolve(__dirname, './app/components'),
            Widgets: path.resolve(__dirname, './app/widgets'),
            Services: path.resolve(__dirname, './app/common/services/service-directory'),
            ServiceManager: path.resolve(__dirname, './app/common/services/service-manager'),
        },
        extensions: ['.js', '.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015', 'stage-0']
                },
                exclude: /(node_modules|bower_components)/
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    }
                ]
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './app/index.hbs'),
            filename: path.resolve(__dirname, './dist/index.html'),
            inject: false
        })
    ]
};