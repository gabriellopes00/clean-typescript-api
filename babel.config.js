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
          '@presentation': './presentation',
          '@main': './main',
          '@domain': './domain',
          '@data': './data',
          '@infra': './infra'
        }
      }
    ]
  ],
  ignore: ['**/*.spec.ts', '**/*.test.ts', '**/*.spec.js', '**/*.test.js']
}
