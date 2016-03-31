var uglify = require('gulp-uglify'),
  minifyCss = require('gulp-minify-css'); /// 실제 사용 여부 확인

var pngquant = require('imagemin-pngquant');

/**
 * Configuration Variables
 */
module.exports = {
  path: {
    initial: './src_init',
    base: './src',
    assets: '/assets',
    src: [
      './src',
      './src/m'
    ],
    build: [
      './build',
      './build/m'
    ],
    tmp: [
      './.tmp',
      './.tmp/m'
    ],
    html: '',
    js: '/js',
    scss: '/scss',
    css: '/css',
    images: '/images',
    font: '/fonts',
    depth: "/**/**/**/**/**/**"
  },
  extension: {
    html: '/*.html',
    js: '/*.js',
    scss: '/*.scss',
    css: '/*.css',
    images: '/*'
  },
  setBasePath: function(folder) {
    this.path.src[0] = './' + folder + '';
    this.path.src[1] = './' + folder + '/m';
  },
  getFullPath: function(folder, fileExt) {
    return [
      folder[0] + this.path[fileExt] + '/**' + this.extension[fileExt],
      folder[1] + this.path[fileExt] + '/**' + this.extension[fileExt]
    ];
  },
  usemin: {
    inlinejs: [uglify()],
    inlinecss: [minifyCss(), 'concat']
  },
  sass: {
    build: {
      outputStyle: 'compressed'
    }
  },
  imagemin: {
    progressive: true,
    svgoPlugins: [{ removeViewBox: false }],
    use: [pngquant()]
  }
};
