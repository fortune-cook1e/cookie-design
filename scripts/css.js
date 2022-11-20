const path = require('path')
const concat = require('gulp-concat')

const { series, src, dest } = require('gulp')
const less = require('gulp-less')

// 将less编译为css
function compile() {
  return src('../src/**/*.less').pipe(less()).pipe(concat('index.css')).pipe(dest('../dist'))
  // .pipe(cssmin())
}

function combine() {
  return src('../src/**/*.less').pipe(concat('cookie-design.less')).pipe(dest('../dist'))
}

exports.default = compile
