module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'dist/main.test.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      }
    ]
  },
  target: 'atom'
};
