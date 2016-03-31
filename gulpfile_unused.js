// Include gulp
//var gulp = require('gulp'); 
/*
 * ###151113
 * Added Using to Parameters
 */
var gulp = require('gulp-param')(require('gulp'), process.argv);

// Include Our Plugins
// ## System
var browserSync = require('browser-sync').create(),
      clean = require('gulp-clean'),
      merge = require('gulp-merge'),
      bower = require('gulp-bower'),
      mainBowerFiles = require("main-bower-files");

// ## Utils
var runSequence = require('run-sequence').use(gulp),
      concat = require('gulp-concat'),
      watch = require('gulp-watch'),
      batch = require('gulp-batch'),
      url = require('url'),
      proxy = require('proxy-middleware'),
      gutil = require('gulp-util');

// ## Optimized
var uglify = require('gulp-uglify'),
      usemin = require('gulp-usemin'),
      minifyHtml = require('gulp-minify-html'),
      minifyCss = require('gulp-minify-css'),
      imagemin = require('gulp-imagemin'),
      pngquant = require('imagemin-pngquant');

// ## Preprocessor
var sass = require('gulp-sass');

// ## Test Tools
var jshint = require('gulp-jshint'),
      htmllint = require('gulp-htmllint');

// Proxy Settings
var proxyHost = 'http://makeulike.com';
var proxyContext = '/mboard';


// Common Settings
/*
 * 경로 json
 * 배열의 0번째 요소는 PC, 1번째 요소는 모바일
 */
var src;
var path = {
  'assets': {
    'common': '/assets/',
    'js': '/assets/js/**/*.js',
    'css': '/assets/css/**/*.css'
  },
  'src': {
    'common': ['./src', './src/m'],
    'html': ['./src/*.html', './src/m/*.html'],
    'scss': ['./src/scss/**/*.scss', './src/m/scss/**/*.scss'],
    'css': ["./src/css", "./src/m/css"],
    'js': ['./src/js/*.js', './src/m/js/**/*.js'],
    'images': ['./src/images/**/**/*', './src/m/images/**/**/*'],
  },
  'tmp': {
    'common': ['./.tmp', './.tmp/m'],
    'html': ['./.tmp/*.html', './.tmp/m/*.html'],
    'scss': ['./.tmp/scss/**/*.scss', './.tmp/m/scss/**/*.scss'],
    'css': ["./.tmp/css", "./.tmp/m/css"],
    'js': ['./.tmp/js/*.js', './.tmp/m/js/**/*.js'],
    'images': ['./.tmp/images/**/**/*', './.tmp/m/images/**/**/*'],
  },
  'build': {
    'common': ['./build', './build/m'],
    'css': ["./build/css", "./build/m/css"],
    'js': ['./build/js', './build/m/js'],
    'images': ['./build/images', './build/m/images'],
  }
}
var depth = "/**/**/**/**/**/**/*";

var changePathSrc = function(value) {
  var key = null;
  for (key in path.src) {
    for (var i = 0; i < path.src[key].length; i++) {
      path.src[key][i] = path.src[key][i].replace('/src', '/' + value);
    }
  }
}

/*
 * ## 160104
 * Labs start
 * @Desc: PHP Server Module Added
 * @Anchor: Jeong MyoungHakl
 */
var php = require('gulp-connect-php'),
  browserSyncInstance = require('browser-sync');

gulp.task('develop-php', function(product, callback) {

  /* Set Folder path */
  src = 'archive/' + product;
  if (product === null) src = 'src'

  changePathSrc(src);

  php.server({
    base: path.src.common[0],
    port: 8080,
    keepalive: true
  });

  browserSyncInstance({
    proxy: '127.0.0.1:8080',
    port: 3030,
    open: true,
    notify: false
  });

  gulp.watch([path.src.common[0] + '*.php'], [browserSyncInstance.reload]);

});
/*
 * ## 160114
 * Labs start
 * @Desc: React(Babel) Compiler Added
 * @Anchor: Jeong MyoungHakl
 */
var babel = require('gulp-babel');

gulp.task('compile-react', function() {
  return gulp.src(path.src.common[0] + '/js/src/*.js')
    .pipe(babel({
      presets: ['react']
    }))
    .pipe(concat('app.js'))
    .pipe(gulp.dest(path.src.common[0] + '/js/'));
});
// ------------- Labs finished -------------- //

/*
 * ## 160219
 * Labs start
 * @Desc: Image to DataURI
  > /images/uri/** 에서 folder(parent)/filename(class) 형태로 data-uri.scss 파일을 생성 시킴.
 * @Anchor: Jeong MyoungHakl
 */
var imageDataURI = require('gulp-image-data-uri');

gulp.task('imageToDataURI', function(product) {

  /* Set Folder path */
  src = 'archive/' + product;
  if (product === null) src = 'src'

  changePathSrc(src);

  return gulp.src(path.src.common[1] + '/images/uri/**/*')
    .pipe(imageDataURI({
      template: {
        file: './templates/data-uri.css'
      },
      customClass: function(className, file) {
        var string = className + '.';
        var filePath = file.path.toString().split('\\');

        return filePath[filePath.length - 2] + '.' + className;
      }
    }))
    .pipe(concat('_data-uri.scss'))
    .pipe(gulp.dest(path.src.common[1] + '/scss/modules'));
});
// ------------- Labs finished -------------- //

// ------------------------------------------------- Task Started! -------------------------------------------------------- //
/*
 * Develop Tasks
 */

// #0 copy Init
gulp.task('init', function() {
  return gulp.src('./src_init' + depth)
    .pipe(gulp.dest('./src'));
});

// #1 process Sass files and return the stream.
gulp.task('compile-sass', function() {
  return gulp.src(path.src.scss[0])
    .pipe(gulp.dest('./.tmp/scss'))
    .pipe(sass({ outputStyle: 'compact' }).on('error', sass.logError))
    .pipe(gulp.dest(path.src.css[0]))
    .pipe(browserSync.stream());
});

gulp.task('compile-sass-mobile', function() {
  return gulp.src(path.src.scss[1])
    .pipe(gulp.dest('./.tmp/m/scss'))
    .pipe(sass({ outputStyle: 'compact' }).on('error', sass.logError))
    .pipe(gulp.dest(path.src.css[1]))
    .pipe(browserSync.stream());
});

// #2 process JS files and return the stream.
gulp.task('js', function() {
  return gulp.src(path.src.js)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

/**
 * HTML Lint 추가 (LF 오인지로 인하여 사용 보류)
 * @date 16.03.29
 */
gulp.task('htmllint', function(){
  return gulp.src(path.src.html)
              .pipe(htmllint({}, function(filepath, issues){
                if (issues.length > 0) {
                  issues.forEach(function (issue) {
                    gutil.log(gutil.colors.cyan('[gulp-htmllint] ') + gutil.colors.white(filepath + ' [' + issue.line + ',' + issue.column + ']: ') + gutil.colors.red('(' + issue.code + ') ' + issue.msg));
                  });
               
                  process.exitCode = 1;
                }
              }));
});

// #3 Using Bower
gulp.task('bower', function() {
  return gulp.src(mainBowerFiles(), { base: "bower_components" })
    .pipe(gulp.dest(config.paths.bower.dest));
});

// ## Task Set
gulp.task('develop', function(product, proxyHost, proxyContext) {
  /*
   * ###151113
   * 각 프로젝트 별 개발 경로를 SRC로 변환하는 작업이 필요.
   */
  src = 'archive/' + product;
  if (product === null) src = 'src'

  changePathSrc(src);

  /*
   * ###160105
   * Get Proxy Options then set value;
   */

  proxyHost = proxyHost;
  proxyContext = proxyContext;

  if (proxyHost === null)
    proxyHost = 'http://localhost';
  if (proxyContext === null)
    proxyContext = '/api';

  /*
   * ### 151113
   * Using Proxy
   */

  var proxyURL = proxyHost + proxyContext;
  var proxyOptions = url.parse(proxyURL);
  proxyOptions.route = proxyContext;

  browserSync.init({
    server: {
      baseDir: ["./", src],
      middleware: [proxy(proxyOptions)]
    }
  });

  /*
   * ### 151113
   * Detect New and Delete Files
   * HTML, SCSS, Js
   */
  watch(path.src.scss[0], batch(function(events, done) {
    gulp.start('compile-sass', done);
  }));

  watch(path.src.scss[1], batch(function(events, done) {
    gulp.start('compile-sass-mobile', done);
  }));

  watch(path.src.js, batch(function(events, done) {
    gulp.start('js', done);
  }));

  gulp.watch(path.src.html).on('change', browserSync.reload);
  gulp.watch(path.src.js).on('change', browserSync.reload);
  gulp.watch(path.src.css[0] + '/*.css').on('change', browserSync.reload);
  gulp.watch(path.src.css[1] + '/*.css').on('change', browserSync.reload);
  gulp.watch(path.src.images).on('change', browserSync.reload);

  /*
   * ### 150114
   * watch reacts
   */

  watch(path.src.common[0] + '/js/src/*.js', batch(function(events, done) {
    gulp.start('compile-react', done);
  }));

});

/*
 * ### 151130
 * Add to Laboratory
 */
gulp.task('labs', function() {
  browserSync.init({
    server: {
      baseDir: ["./", "./src_labs"],
    },
    port: '1000',
    ui: {
      port: '1001'
    }
  });

  gulp.watch('./src_labs' + depth).on('change', browserSync.reload);

})

// ------------------------------------------------------------------------------------------------------------------------- //
/*
 * Build Process
 */

// #1 Clean Folder
gulp.task('clean', function() {
  var tmp = gulp.src(path.tmp.common[0])
    .pipe(clean({ force: true }));

  var common = gulp.src(path.build.common[0])
    .pipe(clean({ force: true }));

  return merge(tmp, common);
});

gulp.task('copy', function() {
  var common = gulp.src(path.src.common[0] + depth)
    .pipe(gulp.dest(path.tmp.common[0]));

  return common;
});

gulp.task('copy-assets', function() {
  var assets = gulp.src(path.src.common[0] + '/assets' + depth)
    .pipe(gulp.dest(path.build.common[0] + '/assets/'));
  return assets;
})

// #2 Usemin
gulp.task('usemin', function() {
  var opt = {
    inlinejs: [uglify()],
    inlinecss: [minifyCss(), 'concat']
  };

  var pc = gulp.src(path.tmp.html[0])
    .pipe(usemin(opt))
    .pipe(gulp.dest(path.build.common[0]));

  var mobile = gulp.src(path.tmp.html[1])
    .pipe(usemin(opt))
    .pipe(gulp.dest(path.build.common[1]));

  return merge(pc, mobile);
});

// #3 Javascript (추후 webpack 로 변경 예정)
gulp.task('build-js', function() {
  var pc = gulp.src(path.tmp.js[0])
    .pipe(gulp.dest(path.build.js[0]));

  var mobile = gulp.src(path.tmp.js[1])
    .pipe(gulp.dest(path.build.js[1]));

  return merge(pc, mobile);
});

// #4 Sass Build 
gulp.task('build-sass', function() {
  var opt = {
    outputStyle: 'compressed'
  };

  var pc = gulp.src(path.tmp.scss[0])
    .pipe(sass(opt))
    .pipe(gulp.dest(path.build.css[0]));

  var mobile = gulp.src(path.tmp.scss[1])
    .pipe(sass(opt))
    .pipe(gulp.dest(path.build.css[1]));

  return merge(pc, mobile);
});

// #5 Images Optimization
gulp.task('build-images', function() {
  var opt = {
    progressive: true,
    svgoPlugins: [{ removeViewBox: false }],
    use: [pngquant()]
  }

  var pc = gulp.src(path.tmp.images[0])
    .pipe(imagemin(opt))
    .pipe(gulp.dest(path.build.images[0]));

  var mobile = gulp.src(path.tmp.images[1])
    .pipe(imagemin(opt))
    .pipe(gulp.dest(path.build.images[1]));

  return merge(pc, mobile);
});

// #6 Assets Uglify
gulp.task('uglify-js', function() {
  var pc = gulp.src(path.build.common[0] + path.assets.js)
    .pipe(uglify())
    .pipe(gulp.dest(path.build.common[0] + path.assets.common + '/js'));
  var mobile = gulp.src(path.build.common[1] + path.assets.js)
    .pipe(uglify())
    .pipe(gulp.dest(path.build.common[1] + path.assets.common + '/js'));

  return merge(pc, mobile);
});

/* Integrate All of tasks*/
gulp.task('build', function(product, callback) {
  /* Set Folder path */
  src = 'archive/' + product;
  if (product === null) src = 'src'

  changePathSrc(src);
  /*
   * ### 151113
   * 모든 테스크들이 동기적으로 실행 안되는 경우 존재, 문제 확인 해야함 
   */
  runSequence('clean', ['copy', 'copy-assets'], ['usemin', 'build-js', 'build-sass', 'build-images'], 'uglify-js');
});
