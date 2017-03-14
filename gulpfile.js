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
// concatanate files
var concat = require('gulp-concat');
// linter
var eslint = require('gulp-eslint');


var config = {
    port: 9005,
    devBaseUrl: 'http://localhost',
    paths: {
        html: './src/*.html',
        js: './src/**/*.js',
        images: './src/images/*',
        css: [
            'node_modules/bootstrap/dist/css/bootstrap.min.css',
            'node_modules/bootstrap/dist/css/bootstrap-theme.min.css',
        ],
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

gulp.task('css', function(){
    gulp.src(config.paths.css)
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest(config.paths.dist + '/css'))
        .pipe(connect.reload());
});

gulp.task('images', function(){
    gulp.src(config.paths.images)
        .pipe(gulp.dest(config.paths.dist + '/images'))
        .pipe(connect.reload());
});

gulp.task('eslint', function(){
    return gulp.src(config.paths.js)
        .pipe(eslint({
            config: 'eslint.config.json',
        }))
        .pipe(eslint.format());
});

gulp.task('watch', function(){
    gulp.watch(config.paths.html, ['html']);
    gulp.watch(config.paths.js, ['js']);
    gulp.watch(config.paths.js, ['eslint']);
});

gulp.task('default', ['html', 'watch', 'js', 'images', 'eslint', 'css', 'open']);