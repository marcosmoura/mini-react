import typescript from 'rollup-plugin-typescript'

export default {
  input: './src/index.ts',
  output: {
    file: './dist/mini-react.js',
    format: 'cjs'
  },
  plugins: [
    typescript()
  ]
}
