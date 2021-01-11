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
          '@presentation': './src/presentation',
          '@main': './src/main',
          '@domain': './src/domain',
          '@data': './src/data',
          '@infra': './src/infra',
          '@utils': './src/utils'
        }
      }
    ]
  ],
  ignore: ['**/*.spec.ts', '**/*.test.ts', '**/*.spec.js', '**/*.test.js']
}
