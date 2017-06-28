'use strict'

const autoprefixer = require('autoprefixer');
const browserify = require('browserify')
const browserSync = require('browser-sync')
const buffer = require('vinyl-buffer')
const concat = require('gulp-concat')
const debug = require('gulp-debug')
const exec = require('child_process').exec
const extract = require('gulp-html-extract')
const gulp = require('gulp')
const gutil = require('gulp-util')
const path = require('path')
const jslint = require('gulp-jslint')
const nodemon = require('gulp-nodemon')
const postcss = require('gulp-postcss');
const rename = require('gulp-rename')
const sass = require('gulp-sass')
const source = require('vinyl-source-stream')
const sourcemaps = require('gulp-sourcemaps')
const uglify = require('gulp-uglify')

const postCSSPlugins = [
  autoprefixer({browsers: ['last 2 version']}),
];

const patterns = {}
  patterns.js = '**/*.js'
  patterns.hbs = '**/*.hbs'
  patterns.sass = '**/*.scss'

const paths = {}
  paths.app = path.join(__dirname, 'app')
  paths.appPublic = path.join(paths.app, 'public')
  paths.appPublic = path.join(paths.app, 'public')
  paths.appPublicJs = path.join(paths.appPublic, 'js')
  paths.appSass = path.join(paths.app, 'sass')
  paths.appPartials = path.join(paths.app, 'partials')

const files = {}
  files.publicJs = path.join(paths.appPublicJs, patterns.js)
  files.allHbs = path.join(paths.app, patterns.hbs)
  files.allSass = path.join(paths.appSass, patterns.sass)

gulp.task('browser-sync', ['nodemon'], function () {
	browserSync.init(null, {
		proxy: "http://localhost:3000",
    files: ["public/**/*.*"],
    browser: "google chrome",
    port: 3100,
	})
})

gulp.task('javascript', function () {
  var b = browserify({
    entries: './app/public/js/app.js',
    debug: true
  })

  return b.bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/js/'))
  })

gulp.task('sass:critical', function () {
  return gulp
    .src(files.allSass)
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: paths.appSass
    }).on('error', sass.logError))
    .pipe(postcss(postCSSPlugins))
    .pipe(sourcemaps.write())
    .pipe(rename(function (path) {
      path.extname = ".css.hbs"
    }))
    .pipe(gulp.dest(paths.appPartials))
  })

gulp.task('sass:theme', function () {
  return gulp
    .src(files.allHbs)
    .pipe(extract({
      sel: ".scss"
    }))
    .pipe(rename(function (path) {
      path.extname = ".scss"
    }))
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: paths.appSass
    }).on('error', sass.logError))
    .pipe(postcss(postCSSPlugins))
    .pipe(sourcemaps.write())
    .pipe(concat('main.css'))
    .pipe(gulp.dest('./public/css'))
    .pipe(browserSync.stream())
  })

gulp.task('nodemon', function (cb) {

	var started = false

	return nodemon({
    ext: 'pug js',
    ignore: ['creds.json', 'public/**/*', 'app/data/*.json']
  }).on('start', function () {
		if (!started) {
			cb()
			started = true
		}
	})
})

gulp.task('production', ['sass:critical', 'sass:theme', 'javascript'])

gulp.task('default', ['sass:critical', 'sass:theme', 'javascript', 'browser-sync'], function () {
  gulp.watch(files.allHbs, ['sass:theme'])
  gulp.watch(files.allSass, ['sass:critical'])
  gulp.watch(files.publicJs, ['javascript']).on('change', browserSync.reload)
})
