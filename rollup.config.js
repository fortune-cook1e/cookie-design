import * as path from 'path'

import alias from '@rollup/plugin-alias'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
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

const createBanner = () => {
  return `/*!
  * ${packageJson.name} v${packageJson.version}
  * (c) ${new Date().getFullYear()}
  * @license MIT
  */`
}

const onwarn = warning => {
  // Silence warning
  if (warning.code === 'CIRCULAR_DEPENDENCY' || warning.code === 'EVAL') {
    return
  }

  console.warn(`(!) ${warning.message}`)
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

const baseConfig = {
  onwarn,
  output: {
    banner: createBanner(),
    sourcemap: false,
    externalLiveBindings: false,
    globals: {
      react: 'react'
    }
  },
  plugins: [
    peerDepsExternal(), // 阻止打包 peer依赖
    commonjs(),
    resolve({
      extensions: EXTENSIONS
    }),
    typescript({ useTsconfigDeclarationDir: true }),
    babel({
      babelrc: true,
      babelHelpers: 'runtime',
      extensions: EXTENSIONS,
      exclude: 'node_modules/**' // 防止打包node_modules下的文件
    }),
    alias({
      entries: [
        {
          find: '@',
          replacement: ROOT_DIR
        }
      ]
    }),
    json(),
    postcss({
      extract: true,
      minimize: !isDev,
      modules: false,
      extensions: ['.less']
    })
    // FIXME: 压缩会导致语法错误
    // !isDev && terser()
  ]
}

function mergeConfig(baseConfig, targetConfig) {
  const config = { ...baseConfig }
  // plugin
  if (targetConfig.plugins) {
    config.plugins.push(...targetConfig.plugins)
  }

  // output
  if (Array.isArray(targetConfig.output)) {
    config.output = targetConfig.output.map(o => ({
      ...baseConfig.input,
      ...o
    }))
  } else {
    config.output = { ...baseConfig.output, ...targetConfig.output }
  }

  // input
  config.input = targetConfig.input

  return config
}

const componentsConfig = mergeConfig(baseConfig, {
  input: './src/index.ts',

  output: [
    {
      file: './dist/es/cookie-ui-esm.js',
      format: 'es'
    },
    {
      file: './dist/cookie-design.js',
      format: 'cjs'
    }
  ]
})

// const typesOption = {
//   input: entry,
//   output: {
//     file: packageJson.types,
//     format: 'esm'
//   },
//   plugins: [...commonPlugins, dts()]
// }

// const hooksOption = {
//   input: hooksFileEntry,
//   output: {
//     file: 'dist/hooks/index.js',
//     format: 'es'
//   },
//   plugins: commonPlugins
// }

export default [componentsConfig]
