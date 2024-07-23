const path = require('path');

module.exports = {
  mode: 'production', // Set the mode to 'production' or 'development'
  entry: {
    index: './src/index.js' // Correct entry point
  },
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory
    filename: '[name].pack.js' // Output file name pattern
  },
  resolve: {
    extensions: ['.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Match JavaScript files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/, // Match CSS files
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};
