module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ],
    '@babel/preset-typescript'
  ],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@repositories': './src/repositories',
          '@models': './src/models',
          '@controllers': './src/controllers',
          '@config': './src/config'
        }
      }
    ]
  ],
  ignore: ['**/*.spec.ts']
}
