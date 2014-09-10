var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');
var clean = require('gulp-clean');
var glob = require('glob');
var exec = require('child_process').exec;

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

gulp.task('uglify', function() {
  gulp.src('js/*.js')
  .pipe(uglify())
  .pipe(gulp.dest('min'));
});

gulp.task('closure', function() {
  var files = glob.sync('js/*.js');

  files.map(function(file) {
    exec('java -jar compiler.jar --language_in ECMASCRIPT5 --js ' + file + ' --js_output_file min/' + file + '.min');
  });

  //gulp.src('js/*.js')
  //.pipe(concat('all.min.js'))
  //.pipe(uglify())
  //.pipe(gulp.dest('min'));
});
