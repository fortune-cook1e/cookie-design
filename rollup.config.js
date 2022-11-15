import * as path from 'path'

import alias from '@rollup/plugin-alias'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import * as fs from 'fs-extra'
import dts from 'rollup-plugin-dts'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
// import { terser } from 'rollup-plugin-terser'
import postcss from 'rollup-plugin-postcss'
import typescript from 'rollup-plugin-typescript2'
// import packageJson from './package.json'

function pathResolve(dir) {
  return path.resolve(__dirname, dir)
}

// 入口
const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx']
const ROOT_DIR = pathResolve('./src')
const entry = pathResolve('./src/index.ts')

// 环境变量
const isDev = process.env.NODE_ENV === 'development'

const componentsDir = path.resolve(__dirname, './src/packages')

// hooks 文件暂时不作入口
const componentsName = fs.readdirSync(path.resolve(componentsDir)).filter(n => n !== 'hooks')
const componentsEntry = componentsName.map(name => `${componentsDir}/${name}/index.ts`)

const commonPlugins = [
  peerDepsExternal(), // 阻止打包 peer依赖
  typescript({ useTsconfigDeclarationDir: true }),
  resolve(),
  commonjs(), // 打包成cjs格式
  babel({
    babelHelpers: 'bundled',
    extensions: EXTENSIONS,
    exclude: '**/node_modules/**',
    presets: ['@babel/preset-env']
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
  // terser({
  // 	ecma: 6
  // })
]

const componentsOption = {
  input: [entry, ...componentsEntry],
  output: {
    preserveModules: true,
    preserveModulesRoot: 'src',
    dir: './dist',
    format: 'esm',
    sourcemap: isDev
  },
  plugins: commonPlugins
}

export default [
  componentsOption,
  {
    ...componentsOption,
    input: entry,
    output: { preserveModules: true, preserveModulesRoot: 'src', dir: 'dist/types', format: 'es' },
    plugins: [...commonPlugins, dts()]
  }
]
