module.exports = {
  presets: ['@babel/preset-env'],
  plugins: [
    [
      'emotion',
      {
        sourceMap: true,
        autoLabel: true
      }
    ]
  ]
}
