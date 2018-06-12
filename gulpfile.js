const babelify    = require('babelify');
const browserify  = require('browserify');
const buffer      = require('vinyl-buffer');
const concat      = require('gulp-concat');
const del         = require('del');
const gulp        = require('gulp');
const imagemin    = require('gulp-imagemin');
const gulpif      = require('gulp-if');
const minifyCSS   = require('gulp-csso');
const sass        = require('gulp-sass');
const source      = require('vinyl-source-stream');
const sourcemaps  = require('gulp-sourcemaps');
const sync        = require('browser-sync').create();
const uglify      = require('gulp-uglify');
const autoprefixer= require('gulp-autoprefixer');
const pxtorem     = require('gulp-pxtorem');
const cleaner     = require('gulp-clean');

const isProd = process.env.NODE_ENV === 'production';

const paths = {
    css: {
      src: [
        './app/scss/style.scss',
      ],
      out: 'style.min.css',
      dist: './dist/css'
    },
    js: {
      src: [
        './app/js/test.js',
        './app/js/app.js'
      ],
      concat: [
        './dist/js/dist.min.js'
      ],
      app: {
        min: 'app.min.js',
        js: 'app.js'
      },
      dist: {
        path: './dist/js',
        clean: './dist/js/dist.min.js',
        min: 'dist.min.js'
      },
    },
    img: {
      src: './app/img/**/*',
      dist: './dist/img'
    },
    fonts: {
      src: './app/fonts/**/*',
      dist: './dist/fonts'
    },
    html: {
      src: './app/**/*.html',
      dist: './dist/'
    },
    dist: [
      'dist'
    ],
    server: {
      baseDir: './dist'
    },
    watch: {
      css: 'app/**/*.scss',
      js: 'app/js/*.js',
      html: 'app/**/*.html',
      img: 'app/img/*'
    }
};

/**
 * SCSS
 */

function scss() {
  return gulp.src(paths.css.src)
    .pipe(concat(paths.css.out))
    .pipe(gulpif(!isProd, sourcemaps.init()))
    .pipe(sass())
    .pipe(autoprefixer({browsers: ['last 2 versions'], cascade: false }))
    .pipe(pxtorem())
    .pipe(minifyCSS())
    .pipe(gulp.dest(paths.css.dist))
    .pipe(sync.stream());
}

/**
 * JS
 */

function js() {
  return browserify({entries: paths.js.src, debug: true})
    .transform(babelify, {presets: 'es2015'})
    .bundle()
    .pipe(source(paths.js.app.js))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(concat(paths.js.dist.min))
    .pipe(gulp.dest(paths.js.dist.path))
    .on('end', function () {
      gulp.src(paths.js.concat)
        .pipe(concat(paths.js.app.min))
        .pipe(gulp.dest(paths.js.dist.path))
        .on('end', function() {
          gulp.src(paths.js.dist.clean)
          .pipe(cleaner({force: true}))
          .pipe(sync.stream());
        });
    });
};

/**
 * IMAGES
 */

function images() {
  return gulp.src(paths.img.src)
    .pipe(gulpif(isProd, imagemin({verbose: true})))
    .pipe(gulp.dest(paths.img.dist));
}

/**
 * FONTS
 */

function fonts() {
  return gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dist));
}

/**
* HTML
*/
function html() {
  return gulp.src(paths.html.src)
  .pipe(gulp.dest(paths.html.dist));
}

/**
 * GLOBAL
 */

function clean() {
  return del(paths.dist);
}



gulp.task('build', gulp.series(clean, gulp.parallel(html, scss, js, images, fonts)));

gulp.task('default', gulp.parallel(html, scss, js, images, fonts, function(done) {
  sync.init({
    server: paths.server
  });

  gulp.watch(paths.watch.css, scss);
  gulp.watch(paths.watch.js, js);
  gulp.watch(paths.watch.html, html);
  gulp.watch(paths.watch.img, images);

  done();
}));
