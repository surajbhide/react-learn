"use strict";

var gulp = require("gulp");
// runs a local dev server
var connect = require("gulp-connect");
// open a url in web browser
var open = require("gulp-open");
// JS bundler
var browserify = require("browserify");
// jsx to js
var reactify = require("reactify");
// use conventional text streams with gulp
var source = require("vinyl-source-stream");

var config = {
    port: 9005,
    devBaseUrl: 'http://localhost',
    paths: {
        html: './src/*.html',
        js: './src/**/.js',
        dist: './dist',
        mainJS: './src/main.js',
    },
};

// start a local dev server
gulp.task('connect', function(){
    connect.server({
        root: ['dist'],
        port: config.port,
        base: config.devBaseUrl,
        livereload: true,
    });
});

gulp.task('open',['connect'], function(){
    gulp.src('dist/index.html')
        .pipe(open({
            uri: config.devBaseUrl + ':' + config.port + '/'
        }));
});

gulp.task('html', function(){
    gulp.src(config.paths.html)
        .pipe(gulp.dest(config.paths.dist))
        .pipe(connect.reload());
});

gulp.task('js', function(){
    browserify(config.paths.mainJS)
        .transform(reactify)
        .bundle()
        .on('error', console.error.bind(console))
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(config.paths.dist + '/scripts'))
        .pipe(connect.reload());
});

gulp.task('watch', function(){
    gulp.watch(config.paths.html, ['html']);
    gulp.watch(config.paths.js, ['js']);
});

gulp.task('default',['html', 'js', 'open', 'watch']);