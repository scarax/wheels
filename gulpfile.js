const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const minify = require('gulp-csso');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const posthtml = require('gulp-posthtml');
const include = require('posthtml-include');
const newer = require('gulp-newer');
const del = require('del');
const browserSync = require('browser-sync').create();

gulp.task('webserver', function() {
  browserSync.init({
    server: 'build/',
    notify: false,
    open: false
  });
});

gulp.task('style', function() {
  return gulp.src('source/sass/style.scss')
  .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
  .pipe(autoprefixer())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('build/css/'))
  .pipe(browserSync.stream());
});

gulp.task('style:build', function() {
  return gulp.src('source/sass/style.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer())
  .pipe(minify({comments: 'false'}))
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('build/css/'))
});

gulp.task('js', function() {
  return gulp.src('source/js/**/*.js')
  // .pipe(uglify())
  .pipe(gulp.dest('build/js/'))
  .pipe(browserSync.stream());
});

gulp.task('html', function() {
  return gulp.src('source/*.html')
  .pipe(newer('build/'))
  .pipe(posthtml([
    include()
  ]))
  .pipe(gulp.dest('build/'))
  .pipe(browserSync.stream());
});

gulp.task('image', function() {
  return gulp.src('source/img/**/*')
  .pipe(newer('build/img/'))
  .pipe(gulp.dest('build/img/'))
  .pipe(browserSync.stream());
});

gulp.task('fonts', function() {
  return gulp.src('source/fonts/**/*.{woff,woff2}')
  .pipe(newer('build/fonts/'))
  .pipe(gulp.dest('build/fonts/'));
});

gulp.task('clean', function() {
  return del('./build');
});

gulp.task('watch', function() {
  gulp.watch('source/*.html', gulp.series('html'));
  gulp.watch('source/sass/**/*.scss', gulp.series('style'));
  gulp.watch('source/js/**/*.js', gulp.series('js'));
  gulp.watch('source/img/**/*', gulp.series('image'));
  gulp.watch('source/fonts/**/*.{woff,woff2}', gulp.series('fonts'));
});

gulp.task('dev', gulp.series(
  'clean',
   gulp.parallel('html', 'style', 'js', 'image', 'fonts')
));

gulp.task('build', gulp.series(
  'clean',
   gulp.parallel('html', 'style:build', 'js', 'image', 'fonts')
));

gulp.task('default', gulp.series('dev', gulp.parallel('webserver', 'watch')));