/** Gulp and Gulp plugin */
var gulp = require('gulp-param')(require('gulp'), process.argv),
  clean = require('gulp-clean'),
  merge = require('gulp-merge'),
  uglify = require('gulp-uglify'),
  usemin = require('gulp-usemin'),
  sass = require('gulp-sass'),
  imagemin = require('gulp-imagemin');

/** Middlewares */
var runSequence = require('run-sequence').use(gulp),
  pngquant = require('imagemin-pngquant');

var config = require('./config');

/** Clean Folder */
gulp.task('clean', function() {
  return gulp.src([ config.path.build[0], config.path.tmp[0] ])
    .pipe(clean({ force: true }));
});

/** Copy src folder to tmp */
gulp.task('copy', function() {
  return gulp.src( config.path.src[0] + config.path.depth )
    .pipe(gulp.dest( config.path.tmp[0] ));
});

/** 
 * Copy Assets
 * @deprecated
 */
gulp.task('copy:assets', function() {
  return gulp.src(config.path.src[0] + config.path.assets + config.path.depth)
    .pipe(gulp.dest(config.path.build[0]  + config.path.assets));
});

/** 
 * Copy JavaScripts (Webpack 으로 교체 예정)
 * @date 160329
 */
gulp.task('copy:js:pc', function() {
  return gulp.src(config.path.src[0] + config.path.js + config.extension.js)
    .pipe(gulp.dest(config.path.build[0]  + config.path.js));
});

gulp.task('copy:js:mobile', function() {
  return gulp.src(config.path.src[1] + config.path.js + config.extension.js)
    .pipe(gulp.dest(config.path.build[1]  + config.path.js));
});

/** 
 * Copy Fonts (Webpack 으로 교체 예정)
 * @date 160329
 */
gulp.task('copy:font:pc', function() {
  return gulp.src(config.path.src[0] + config.path.font + config.extension.depth)
    .pipe(gulp.dest(config.path.build[0]  + config.path.font));
});

gulp.task('copy:font:mobile', function() {
  return gulp.src(config.path.src[1] + config.path.font + config.extension.depth)
    .pipe(gulp.dest(config.path.build[1]  + config.path.font));
});

/** Usemin */
gulp.task('usemin:pc', function() {
  return gulp.src( config.path.tmp[0] + config.extension.html )
    .pipe(usemin(config.usemin))
    .pipe(gulp.dest(config.path.build[0]));
});

gulp.task('usemin:mobile', function() {
  return mobile = gulp.src( config.path.tmp[1] + config.extension.html )
    .pipe(usemin(config.usemin))
    .pipe(gulp.dest(config.path.build[1]));
});

/** Sass Build */
gulp.task('sass:build:pc', function() {
  return gulp.src(config.path.tmp[0] + config.path.scss + config.extension.scss)
    .pipe(sass(config.sass.build))
    .pipe(gulp.dest(config.path.build[0] + config.path.css));
});

gulp.task('sass:build:mobile', function() {
  return gulp.src(config.path.tmp[1] + config.path.scss + config.extension.scss)
    .pipe(sass(config.sass.build))
    .pipe(gulp.dest(config.path.build[1] + config.path.css));
});

/** Images Optimization (imagemin) */
gulp.task('imagemin:pc', function() {
  return gulp.src(config.path.tmp[0] + config.path.images + config.path.depth)
    .pipe(imagemin(config.imagemin))
    .pipe(gulp.dest(config.path.build[0] + config.path.images));
});

gulp.task('imagemin:mobile', function() {
  return gulp.src(config.path.tmp[1] + config.path.images + config.path.depth)
    .pipe(imagemin(config.imagemin))
    .pipe(gulp.dest(config.path.build[1] + config.path.images));
});

/** Uglify Assets */
gulp.task('uglify:assets:pc', ['usemin:pc'], function() {
  return gulp.src( config.path.build[0] + config.path.assets + config.path.js + config.extension.js )
    .pipe(uglify())
    .pipe(gulp.dest( config.path.build[0] + config.path.assets + config.path.js ))
});

gulp.task('uglify:assets:mobile', ['usemin:mobile'], function() {
  return gulp.src( config.path.build[1] + config.path.assets + config.path.js + config.extension.js )
    .pipe(uglify())
    .pipe(gulp.dest( config.path.build[1] + config.path.assets + config.path.js ))
});

/* Integrate All of tasks*/
gulp.task('build', function(product, callback) {

  /**
   * 각 프로젝트 별 개발 경로를 SRC로 변환하는 작업이 필요.
   * @date 151113
   */
  if (product !== null) {
    config.path.base = 'archive/' + product;
    config.setBasePath(config.path.base);
  }

  runSequence(
    'clean',
    'copy',
    'copy:js:pc',
    'copy:js:mobile',
    'copy:font:pc',
    'copy:font:mobile',
    'copy:assets',
    [
      'usemin:pc', 
      'usemin:mobile', 
      'sass:build:pc', 
      'sass:build:mobile', 
      'imagemin:pc',
      'imagemin:mobile'
    ], 
    [
      'uglify:assets:pc',
      'uglify:assets:mobile'
    ]);
});
