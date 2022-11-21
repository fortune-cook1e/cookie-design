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

// 入口
const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx']
const ROOT_DIR = pathResolve('./src')
const entry = pathResolve('./src/index.ts')
const hooksDir = pathResolve('./src/hooks')
const hooksFileEntry = pathResolve('./src/hooks.ts')
const componentsDir = pathResolve('./src/packages')
const componentsName = fs.readdirSync(componentsDir)
const componentsEntry = componentsName.map(name => `${componentsDir}/${name}/index.ts`)

const isDev = process.env.NODE_ENV === 'development'

const baseConfig = {
  external: ['react', 'react-dom', 'lodash-es', 'lodash'],
  output: {
    banner: createBanner(),
    sourcemap: false,
    externalLiveBindings: false,
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      'lodash-es': 'lodash',
      'framer-motion': 'framerMotion'
    }
  },

  plugins: [
    peerDepsExternal(),
    commonjs(),
    resolve({
      extensions: EXTENSIONS
    }),
    typescript({ useTsconfigDeclarationDir: true }),
    babel({
      babelrc: true,
      babelHelpers: 'runtime',
      extensions: EXTENSIONS,
      exclude: 'node_modules/**'
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
    json(),
    postcss({
      extract: true,
      minimize: !isDev,
      modules: false,
      extensions: ['.less', '.css']
    })
  ]
}

const componentConfig = {
  ...baseConfig,
  input: entry,
  output: [
    {
      ...baseConfig.output,
      file: './dist/cookie-design-umd.js',
      format: 'umd',
      name: 'cookie-design'
    },
    {
      ...baseConfig.output,
      file: packageJson.module,
      format: 'es'
    },
    {
      ...baseConfig.output,
      file: packageJson.main,
      format: 'cjs'
    }
  ],
  plugins: [...baseConfig.plugins, terser()]
}

const typesOption = {
  ...baseConfig,
  input: entry,
  output: {
    ...baseConfig.output,
    file: packageJson.types,
    format: 'esm'
  },
  plugins: [...baseConfig.plugins, dts()]
}

export default [componentConfig, typesOption]
