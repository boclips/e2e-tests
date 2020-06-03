module.exports = {
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'ts-loader',
        }],
      },
      {
        test: /.*\/node_modules\/axe-core\/axe.js$/,
        use: ['raw-loader'],
      },
    ],
  },
}
