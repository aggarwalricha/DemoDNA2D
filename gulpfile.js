var gulp = require('gulp');
var webserver = require('gulp-webserver');

gulp.task('serve', function(){
return gulp.src('./app/')
    .pipe(webserver({
      livereload: true,
      fallback: 'index.html',
      open: true,
      port:8080
    }));
});
