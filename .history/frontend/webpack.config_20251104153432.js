module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "bundle.js",
        path: __dirname + "/dist"
    },
    mode: "development",
    module: {
        rules: [
            { test: /\.(js|jsx)$/, exclude: /node_modules/, use: "babel-loader" },
            { test: /\.css$/, use: ["style-loader", "css-loader", "postcss-loader"] }
        ]
    },
    resolve: { extensions: [".js", ".jsx"] },
    plugins: [
        new (require("html-webpack-plugin"))({ template: "./public/index.html" })
    ],
    devServer: { static: "./dist", hot: true, port: 3000 }
};
