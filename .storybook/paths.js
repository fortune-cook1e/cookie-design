const { resolve } = require('path')

const resolvePath = dir => resolve(__dirname, dir)

module.exports = {
	src: resolvePath('../src')
}
