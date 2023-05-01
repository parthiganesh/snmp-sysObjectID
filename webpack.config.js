module.exports = {
    mode: 'production',
    entry: './src/index.ts',
    output: {
      filename: 'bundle.js',
      libraryTarget: 'umd',
      globalObject: 'this'
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
  };
  