module.exports = [{
    mode: 'development',
    entry: {
        client: './src/test-client/index.ts',
    },
    output: {
        filename: '[name].js',
        path: `${__dirname}/public`,
    },
    module: {
        rules: [{
            test: /\.ts$/,
            use: "ts-loader",
            exclude: /node_modules/,
        }]
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
}]
