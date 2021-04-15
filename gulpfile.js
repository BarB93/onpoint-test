const { src, dest, watch, parallel, series } = require('gulp')

const scss = require('gulp-sass')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify-es').default
const autoprefixer = require('gulp-autoprefixer')
const del = require('del')
const browserSync = require('browser-sync').create()
const ttf2woff = require("gulp-ttf2woff")
const ttf2woff2 = require("gulp-ttf2woff2")
const fileinclude = require("gulp-file-include")

function browsersync() {
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });
}


function styles() {
    return src('app/scss/*.scss')
        .pipe(scss({
            outputStyle: 'expanded',
        }))
        .pipe(concat('style.min.css'))
        .pipe(autoprefixer({
            cascade: false,
            overrideBrowserslist: ['last 10 version'],
            grid: true
        }))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())
}

function scripts() {
    return src([
        'app/js/main.js'
    ])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream())
}

function build() {
    return src([
        'app/css/style.min.css',
        'app/js/main.min.js',
        'app/*.html',
        '!app/_*.html',
        'app/fonts/*.{woff,woff2}'

    ], { base: 'app' })
        .pipe(dest('dist'))
}

function cleanDist() {
    return del('dist')
}

function watching() {
    watch(['app/scss/**/*.scss'], styles)
    watch(['app/js/main.js', '!app/js/main.min.js'], scripts)
    watch('app/*.html').on('change', browserSync.reload)
}

function ttftowoff() {
    return src(['app/fonts/*.ttf'])
        .pipe(ttf2woff())
        .pipe(dest('app/fonts'))
}

function ttftowoff2() {
    return src(['app/fonts/*.ttf'])
        .pipe(ttf2woff2())
        .pipe(dest('app/fonts'))
}

exports.styles = styles
exports.watching = watching
exports.browsersync = browsersync
exports.scripts = scripts
exports.cleanDist = cleanDist

exports.fonts = series(ttftowoff, ttftowoff2)
exports.build = series(cleanDist, build)
exports.default = parallel(styles, scripts, browsersync, watching)