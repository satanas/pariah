var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var clean= require('gulp-clean');

gulp.task('default', function() {
  gulp.src('js/*.js')
  .pipe(concat('all.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('.'));

  gulp.src('style.css')
  .pipe(concat('style.min.css'))
  .pipe(minifyCSS())
  .pipe(gulp.dest('.'));
});

gulp.task('clean', function() {
  gulp.src('style.min.css')
  .pipe(clean());
  gulp.src('*.zip')
  .pipe(clean());
  gulp.src('all.min.js')
  .pipe(clean());
});
