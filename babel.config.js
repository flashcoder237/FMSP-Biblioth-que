module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        electron: '25.0.0' // Ajustez selon votre version d'Electron
      }
    }],
    ['@babel/preset-react', {
      runtime: 'automatic' // Utilise la nouvelle JSX transform de React 17+
    }],
    '@babel/preset-typescript'
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-private-methods'
  ]
};