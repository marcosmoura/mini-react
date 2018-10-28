import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript'
import { uglify } from 'rollup-plugin-uglify'
import rimraf from 'rimraf'
import pkg from './package.json'

const libPlugins = [
  commonjs(),
  typescript()
]
const libMinPlugins = [
  ...libPlugins,
  uglify()
]

export default new Promise((resolve) => {
  rimraf('./dist', () => (
    resolve([
      {
        input: './src/index.ts',
        output: {
          name: 'MiniReact',
          file: pkg.browser,
          format: 'umd',
          exports: 'named'
        },
        plugins: libPlugins
      },
      {
        input: './src/index.ts',
        output: {
          file: `dist/${pkg.name}.min.js`,
          format: 'cjs',
          exports: 'named'
        },
        plugins: libMinPlugins
      },
      {
        input: './src/index.ts',
        output: [
          {
            file: pkg.main,
            format: 'cjs',
            exports: 'named'
          },
          {
            file: pkg.module,
            format: 'es',
            exports: 'named'
          }
        ],
        plugins: libPlugins
      }
    ])
  ))
})
