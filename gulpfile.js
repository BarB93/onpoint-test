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
const imagemin = require('gulp-imagemin');
const gulpPug = require('gulp-pug');


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
            outputStyle: 'compressed',
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

function images() {
    return src('app/images/*/*')
        .pipe(imagemin({
            progressive: true,
            svgPlugins: [{ removeViewBox: false }],
            interlaced: true,
            optimizationLevel: 3
        }))
        .pipe(dest('dist/images'))
}

function pug() {
    return src('app/*.pug')
        .pipe(gulpPug({
            pretty: true
        }))
        .pipe(dest('app'))
        .pipe(browserSync.stream())

}

function build() {
    return src([
        'app/css/style.min.css',
        'app/js/main.min.js',
        'app/*.html',
        'app/fonts/*.{woff,woff2}',
        'app/images/*/*',
        'app/images/*'

    ], { base: 'app' })
        .pipe(dest('docs'))
}

function cleanDist() {
    return del('docs')
}

function watching() {
    watch(['app/scss/**/*.scss'], styles)
    watch(['app/js/main.js', '!app/js/main.min.js'], scripts)
    watch('app/*.html').on('change', browserSync.reload)
}

function watching() {
    watch(['app/scss/**/*.scss'], styles)
    watch(['app/js/main.js', '!app/js/main.min.js'], scripts)
    watch('app/*.html').on('change', browserSync.reload)
}

function watching() {
    watch(['app/scss/**/*.scss'], styles)
    watch(['app/js/main.js', '!app/js/main.min.js'], scripts)
    watch(['app/*.pug'], pug)
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
exports.images = images
exports.pug = pug

exports.fonts = series(ttftowoff2, ttftowoff)
exports.build = series(cleanDist, build)
exports.default = parallel(styles, scripts, browsersync, pug, watching)