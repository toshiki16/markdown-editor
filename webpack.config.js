const path = require('path')

module.exports = {
    mode: 'production',
    entry: './src/index.tsx',
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
        publicPath: 'dist/',
    },

    devServer: {
        hot: true,
        open: true,
        static: {
            directory: path.join(__dirname, '/')
        },
    },
    performance: {
        hints: false,
        maxEntrypointSize: 1024000,
        maxAssetSize: 1024000
    }
}