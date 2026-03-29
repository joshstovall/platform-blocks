module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    ['@babel/preset-typescript', { allowDeclareFields: true }],
  ],
  plugins: [
    '@babel/plugin-transform-class-properties',
    ['@babel/plugin-transform-flow-strip-types', { requireDirective: false }],
    'react-native-worklets/plugin'
  ],
};
