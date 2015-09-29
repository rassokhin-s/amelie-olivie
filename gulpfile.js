var gulp      = require('gulp'),
    less      = require('gulp-less'),
    minifyCSS = require('gulp-minify-css'),
    rename    = require('gulp-rename'),
    bless     = require('gulp-bless'),
    connect   = require('gulp-connect'),
    jade      = require('gulp-jade'),
    clean     = require('gulp-clean');

var paths = {
    lessAllFiles: './public/src/less/**/*.less',
    lessGeneralFiles: './src/less/*.less',
    cssAllFiles: './public/css/*.css',
    cssDestFiles: './public/css',
    cssMinDestFiles: './public/css/min',
    jadeAllFiles: './views/**/*.jade',
    jadeGeneralFiles: './views/*.jade',
    htmlAllFiles: './*.html',
    htmlDestFiles: './'
};

// checkes files for ie9 selectors limits
gulp.task('bless', function () {
    gulp.src(paths.cssAllFiles)
        .pipe(bless())
        .pipe(gulp.dest(paths.cssDestFiles));
});

// removes all html files in root directory
gulp.task('clean-html', function () {
    return gulp.src(paths.htmlAllFiles, {read: false})
        .pipe(clean());
});

gulp.task('jade', ['clean-html'], function() {
    var locals = {};

    gulp.src(paths.jadeGeneralFiles)
        .pipe(jade({
            locals: locals,
            pretty: true
        }))
        .pipe(gulp.dest(paths.htmlDestFiles))
});

// minifies required css files with ".min" suffix
gulp.task('minify-css', function () {
    return gulp.src(paths.cssAllFiles)
        .pipe(minifyCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.cssMinDestFiles));
});

// generates css files from less
gulp.task('less', function () {
    return gulp.src(paths.lessGeneralFiles)
        .pipe(less())
        .pipe(gulp.dest(paths.cssDestFiles));
});

// watches for changes in files (currently for *.less)
gulp.task('watch', function () {
    gulp.watch(paths.lessAllFiles, ['less', 'bless']);
    gulp.watch(paths.jadeAllFiles, ['jade']);
});

// starts node.js server on given port
gulp.task('connect', function () {
    connect.server({
        port: 8888
    });
});

gulp.task('default', ['connect', 'less', 'jade', 'watch']);
gulp.task('production', ['minify-css']);