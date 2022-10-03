import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import postcssPresetImport from 'postcss-import'
import postcssPresetEnv from 'postcss-preset-env'
import * as path from 'path'
import * as fs from 'fs-extra'

const { resolve } = path

const PORT = 8080
const API_PREFIX = '/api'
const API_HOST = 'http://localhost:3000'

const componentsDir = path.resolve(__dirname, './src/packages')
const componentsNames = fs.readdirSync(path.resolve(componentsDir))

const PATHS = {
	// Source files
	src: resolve(__dirname, './src'),

	// Production build files
	build: resolve(__dirname, './dist'),

	// Static files that get copied to build folder
	public: resolve(__dirname, './public')
}

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	define: {
		IS_DEV: false,
		COMPONENTS: componentsNames
	},
	css: {
		postcss: {
			plugins: [postcssPresetImport, postcssPresetEnv]
		}
	},
	resolve: {
		alias: {
			'@': PATHS.src
		}
	},
	server: {
		port: PORT,
		strictPort: true,
		proxy: {
			[`${API_PREFIX}`]: {
				target: API_HOST,
				rewrite: path => path.replace(/^\/api/, '')
			}
		}
	}
})
