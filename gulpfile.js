var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');
var clean= require('gulp-clean');

gulp.task('default', function() {
  gulp.src('js/*.js')
  .pipe(concat('all.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('min'));

  gulp.src('style.css')
  .pipe(minifyCSS())
  .pipe(gulp.dest('min'));

  gulp.src('index.html')
  .pipe(minifyHTML())
  .pipe(gulp.dest('min'));
});

gulp.task('clean', function() {
  gulp.src('style.min.css')
  .pipe(clean());
  gulp.src('*.zip')
  .pipe(clean());
  gulp.src('all.min.js')
  .pipe(clean());
});
