import * as path from 'path'

import alias from '@rollup/plugin-alias'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import * as fs from 'fs-extra'
import dts from 'rollup-plugin-dts'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'

import packageJson from './package.json'

function pathResolve(dir) {
  return path.resolve(__dirname, dir)
}

// 入口
const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx']
const ROOT_DIR = pathResolve('./src')
const entry = pathResolve('./src/index.ts')
const hooksDir = pathResolve('./src/hooks')
const hooksFileEntry = pathResolve('./src/hooks.ts')
const hooksEntry = fs.readdirSync(hooksDir).map(name => `${hooksDir}/${name}/index.ts`)
const componentsDir = pathResolve('./src/packages')
const componentsName = fs.readdirSync(componentsDir)
const componentsEntry = componentsName.map(name => `${componentsDir}/${name}/index.ts`)

// 环境变量
const isDev = process.env.NODE_ENV === 'development'

const commonPlugins = [
  peerDepsExternal(), // 阻止打包 peer依赖
  resolve({
    extensions: EXTENSIONS
  }),
  commonjs(),
  typescript({ useTsconfigDeclarationDir: true }),
  babel({
    babelHelpers: 'runtime',
    extensions: EXTENSIONS,
    exclude: 'node_modules/**' // 防止打包node_modules下的文件
  }),
  alias({
    resolve: EXTENSIONS,
    entries: [
      {
        find: '@',
        replacement: ROOT_DIR
      }
    ]
  }),
  postcss({
    extract: true,
    minimize: !isDev,
    modules: false,
    extensions: ['.less']
  })
  // FIXME: 压缩会导致语法错误
  // terser()
]

const componentsOption = {
  input: [entry, ...componentsEntry],
  // FIXME: 暂时不引入 extenal
  output: [
    {
      dir: 'dist',
      format: 'esm'
    }
    // {
    //   dir: 'lib',
    //   format: 'cjs'
    // }
  ],

  plugins: commonPlugins
}

const typesOption = {
  input: entry,
  output: {
    file: packageJson.types,
    format: 'esm'
  },
  plugins: [...commonPlugins, dts()]
}

const hooksOption = {
  input: hooksFileEntry,
  output: {
    file: 'dist/hooks/index.js',
    format: 'esm'
  },
  plugins: commonPlugins
}

export default [typesOption]
