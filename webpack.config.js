const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';

// Configuration pour le processus main
const mainConfig = {
  name: 'main', // ← Ajouter le nom
  mode: isDevelopment ? 'development' : 'production',
  entry: './src/main.ts',
  target: 'electron-main',
  devtool: isDevelopment ? 'source-map' : false,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    clean: false,
  },
  externals: {
    // IMPORTANT: Externaliser SQLite3 et autres modules natifs
    'sqlite3': 'commonjs sqlite3',
    'archiver': 'commonjs archiver',
    'extract-zip': 'commonjs extract-zip',
    'yauzl': 'commonjs yauzl',
    '@supabase/supabase-js': 'commonjs @supabase/supabase-js',
  },
  node: {
    __dirname: false,
    __filename: false,
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

// Configuration pour preload
const preloadConfig = {
  name: 'preload', // ← Ajouter le nom
  mode: isDevelopment ? 'development' : 'production',
  entry: './src/preload.ts',
  target: 'electron-preload',
  devtool: isDevelopment ? 'source-map' : false,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'preload.js',
    clean: false,
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: path.resolve(__dirname, 'tsconfig.json')
          }
        },
        exclude: /node_modules/,
      },
    ],
  },
  // Optimisations pour preload
  optimization: {
    minimize: !isDevelopment,
  },
};

// Configuration pour renderer
const rendererConfig = {
  name: 'renderer', // ← Ajouter le nom
  mode: isDevelopment ? 'development' : 'production',
  entry: './src/renderer/index.tsx',
  target: 'electron-renderer',
  devtool: isDevelopment ? 'source-map' : false,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'renderer.js',
    clean: false,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: path.resolve(__dirname, 'tsconfig.renderer.json'),
            transpileOnly: false,
          }
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/renderer/index.html',
      filename: 'index.html',
      inject: true,
    }),
  ],
  // Optimisations pour renderer
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};

module.exports = [mainConfig, preloadConfig, rendererConfig];