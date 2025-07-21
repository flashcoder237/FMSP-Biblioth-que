const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';

// Configuration pour le processus main
const mainConfig = {
  name: 'main',
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
        use: {
          loader: 'ts-loader',
          options: {
            configFile: path.resolve(__dirname, 'tsconfig.main.json')
          }
        },
        exclude: /node_modules/,
      },
    ],
  },
};

// Configuration pour preload
const preloadConfig = {
  name: 'preload',
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
            configFile: path.resolve(__dirname, 'tsconfig.main.json')
          }
        },
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimize: !isDevelopment,
  },
};

// Configuration pour renderer - CORRIGÉE POUR JSX
const rendererConfig = {
  name: 'renderer',
  mode: isDevelopment ? 'development' : 'production',
  entry: './src/renderer/index.tsx',
  target: 'electron-renderer',
  devtool: isDevelopment ? 'source-map' : false,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].[chunkhash].chunk.js',
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
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: path.resolve(__dirname, 'tsconfig.renderer.json')
          }
        }
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
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          filename: 'vendors.[contenthash].js',
        },
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react',
          chunks: 'all',
          filename: 'react.[contenthash].js',
        },
        supabase: {
          test: /[\\/]node_modules[\\/]@supabase[\\/]/,
          name: 'supabase',
          chunks: 'all',
          filename: 'supabase.[contenthash].js',
        },
      },
    },
  },
  // Fix for "global is not defined" and "require is not defined" errors
  node: {
    global: true,
    __dirname: false,
    __filename: false,
  },
  // Remove Node.js modules from renderer externals to prevent require issues
  externals: {
    'electron': 'require("electron")',
    'fs': 'require("fs")',
    'path': 'require("path")',
  },
};

module.exports = [mainConfig, preloadConfig, rendererConfig];