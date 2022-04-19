import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import external from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import typescript from 'rollup-plugin-typescript2'
import dts from 'rollup-plugin-dts'
import alias from '@rollup/plugin-alias'
import visualizer from 'rollup-plugin-visualizer'
import * as path from 'path'

const packageJson = require('./package.json')

const EXTENSIONS = ['.ts', '.tsx', '.js']
const ROOT_DIR = path.resolve(__dirname, './src')

export default [
	{
		input: 'src/index.ts',
		output: [
			{
				file: packageJson.main,
				format: 'cjs',
				sourcemap: true,
				name: 'cookie-ui'
			},
			{
				file: packageJson.module,
				format: 'esm',
				sourcemap: true
			}
		],
		plugins: [
			external(), // 阻止打包 peer依赖
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
			commonjs(), // 打包成cjs格式
			typescript({ useTsconfigDeclarationDir: true }),
			postcss({
				modules: false, // 模块化
				minimize: true,
				use: {
					sass: null,
					stylus: null,
					less: { javascriptEnabled: true }
				},
				extract: true,
				config: false // 不走配置文件 与 webpack隔离
			}),
			terser(), // 压缩bundle
			visualizer({
				filename: 'bundle-analysis.html',
				open: true
			})
		]
	},
	{
		input: 'dist/esm/types/index.d.ts',
		output: [{ file: 'dist/index.d.ts', format: 'esm' }],
		external: [/\.css$/],
		plugins: [dts()]
	}
]
