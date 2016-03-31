/** Gulp and Gulp plugin */
var gulp = require('gulp-param')(require('gulp'), process.argv),
  watch = require('gulp-watch'),
  batch = require('gulp-batch'),
  sass = require('gulp-sass'),
  jshint = require('gulp-jshint');

/** Middlewares */
var browserSync = require('browser-sync').create(),
  url = require('url'),
  proxy = require('proxy-middleware');

var config = require('./config');

/** Copy Initial Files */
gulp.task('init', function() {
  return gulp.src(config.path.initial + config.path.depth)
    .pipe(gulp.dest(config.path.src[0]));
});

/** Sass Development */
gulp.task('sass:develop:pc', function() {
  var opt = {
    outputStyle: 'compact'
  };

  return gulp.src(config.getFullPath(config.path.src, 'scss')[0])
    .pipe(gulp.dest(config.path.tmp[0] + config.path.scss))
    .pipe(sass(opt).on('error', sass.logError))
    .pipe(gulp.dest(config.path.src[0] + config.path.css));
});

gulp.task('sass:develop:mobile', function() {
  var opt = {
    outputStyle: 'compact'
  };

  return gulp.src(config.getFullPath(config.path.src, 'scss')[1])
    .pipe(gulp.dest(config.path.tmp[1] + config.path.scss))
    .pipe(sass(opt).on('error', sass.logError))
    .pipe(gulp.dest(config.path.src[1] + config.path.css));
});

/** JavaScript Lint */
gulp.task('js:lint:pc', function() {
  return gulp.src(config.getFullPath(config.path.src, 'js')[0])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('js:lint:mobile', function() {
  return gulp.src(config.getFullPath(config.path.src, 'js')[1])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

/** Development Tasks */
gulp.task('develop', function(product, proxyHost, proxyContext) {

  /**
   * 각 프로젝트 별 개발 경로를 SRC로 변환하는 작업이 필요.
   * @date 151113
   */
  if (product !== null) {
    config.path.base = 'archive/' + product;
    config.setBasePath(config.path.base);
  }

  /**
   * 프록시 서버 세팅 (매개변수 이용)
   * @date 160105
   */
  if (proxyHost === null) proxyHost = 'http://localhost';
  if (proxyContext === null) proxyContext = '/api';

  /**
   * 프록시 서버 사용
   * @date 151113
   */
  var proxyURL = proxyHost + proxyContext;
  var proxyOptions = url.parse(proxyURL);
  proxyOptions.route = proxyContext;

  /**
   * BrowserSync 사용 (with Proxy Middleware)
   */
  browserSync.init({
    server: {
      baseDir: ["./", config.path.src[0]],
      middleware: [proxy(proxyOptions)]
    }
  });

  /**
   * Detect New and Delete Files
   * HTML, SCSS, Js
   * @date 151113
   */
  watch(config.getFullPath(config.path.src, 'scss')[0], batch(function(events, done) {
    gulp.start('sass:develop:pc', done);
  }));
  watch(config.getFullPath(config.path.src, 'scss')[1], batch(function(events, done) {
    gulp.start('sass:develop:mobile', done);
  }));

  watch(config.getFullPath(config.path.src, 'js')[0], batch(function(events, done) {
    gulp.start('js:lint:pc', done);
  }));
  watch(config.getFullPath(config.path.src, 'js')[1], batch(function(events, done) {
    gulp.start('js:lint:mobile', done);
  }));

  gulp.watch(config.getFullPath(config.path.src, 'html'))
    .on('change', browserSync.reload);

  gulp.watch(config.getFullPath(config.path.src, 'js'))
    .on('change', browserSync.reload);

  gulp.watch(config.getFullPath(config.path.src, 'css'))
    .on('change', browserSync.reload);

  gulp.watch(config.getFullPath(config.path.src, 'images'))
    .on('change', browserSync.reload);

});
