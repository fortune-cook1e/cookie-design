import * as path from 'path'
import * as fs from 'fs-extra'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import alias from '@rollup/plugin-alias'
import { terser } from 'rollup-plugin-terser'

import typescript from 'rollup-plugin-typescript2'
import postcss from 'rollup-plugin-postcss'
// import json from '@rollup/plugin-json'
import babel from '@rollup/plugin-babel'
import packageJson from './package.json'
// import dts from 'rollup-plugin-dts'

// 入口

const hooksDir = 'src/hooks/index.ts'
// const hooksDir = 'src/hooks'
// const hooksName = fs.readdirSync(path.resolve(hooksDir))
// const hooksEntry = hooksName.map(name => {
// 	if (name === 'index.ts') return
// 	return `hooks/${name}/index.ts`
// })

const EXTENSIONS = ['.ts', '.tsx', '.js', '.less']
const ROOT_DIR = path.resolve(__dirname, './src')

// 环境变量
const isProd = process.env.NODE_ENV === 'production'

// sass打包
const processScss = function (context) {
	return new Promise((resolve, reject) => {
		sass.compile(
			{
				file: context
			},
			function (err, result) {
				if (!err) {
					resolve(result)
				} else {
					reject(result)
				}
			}
		)
		sass.compile(context, {}).then(
			function (output) {
				if (output && output.css) {
					resolve(output.css)
				} else {
					reject({})
				}
			},
			function (err) {
				reject(err)
			}
		)
	})
}

// ES Module打包输出
const esmOutput = {
	preserveModules: true,
	// preserveModulesRoot: 'src',
	// exports: 'named',
	assetFileNames: ({ name }) => {
		const { ext, dir, base } = path.parse(name)
		if (ext !== '.css') return '[name].[ext]'
		// 规范 style 的输出格式
		return path.join(dir, 'style', base)
	}
}

export default {
	input: [hooksDir],
	output: {
		dist: path.resolve(__dirname, './dist'),
		file: packageJson.module,
		format: 'esm',
		sourcemap: true
	},
	// external: externalConfig,
	plugins: [
		commonjs(), // 打包成cjs格式
		babel({
			babelHelpers: 'bundled',
			extensions: EXTENSIONS,
			// exclude: '**/node_modules/**',
			presets: ['@babel/preset-env', '@babel/preset-typescript', '@babel/preset-react']
		}),
		peerDepsExternal(), // 阻止打包 peer依赖
		resolve(),
		alias({
			resolve: EXTENSIONS,
			entries: [
				{
					find: '@',
					replacement: ROOT_DIR
				}
			]
		}),

		typescript({ useTsconfigDeclarationDir: true }),
		postcss({
			minimize: true,
			modules: true,
			use: {
				sass: null,
				stylus: null,
				less: { javascriptEnabled: true }
			},
			extensions: ['.less'],
			extract: true
		}),
		terser() // 压缩bundle
		// visualizer({
		// 	filename: 'bundle-analysis.html',
		// 	open: true
		// })
		// postcss({
		// 	extract: true
		// 	// process: processScss
		// }),
	]
}
