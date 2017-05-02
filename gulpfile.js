'use strict';

require('dotenv').load();

var gulp = require('gulp');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
var inject = require('gulp-inject');
var clean = require('gulp-clean');
var series = require('stream-series');
var sass = require('gulp-sass');
var nodemon = require('gulp-nodemon');
var jsdoc = require('gulp-jsdoc3');
var inject_string = require('gulp-inject-string');

// --- Environment ---
var envs = {
    dev: 'dev',
    prod: 'prod'
};

var environment = process.env.ENVIRONMENT || envs.dev;


// --- Paths ---

var paths = {

    config: 'config/*',
    jshintPaths: ['public/js/**/*.js', 'app/**/*.js'],
    jsdocPaths: ['README.md', 'app/**/*.js']

};

var sources = {

    appjs: 'public/js/app.js',
    angularFiles:  ['public/js/**/*', '!public/js/config/*'],
    frontEndConfigs: 'public/js/config/',
    env: '.env',
    favicon: 'public/favicon.ico',
    files: 'public/files/*',
    index: 'public/index.html',
    injectedJs:  ['public/js/**/*.js', '!public/js/app.js', '!public/js/config/*'],
    libs: 'public/libs/**/*',
    node: ['app/**/*'],
    sass: 'public/sass/**/*.scss',
    server: 'server.js',
    views: 'public/views/**/*'

};

var dest = {

    config: 'dist/config',
    configName: 'config.js',
    frontEndConfig: 'dist/public/js/config',
    frontEndConfigName: 'config.js',
    css: 'dist/public/css',
    dist: 'dist/',
    env: 'dist',
    files: 'dist/public/files',
    angularFiles: 'dist/public/js',
    libs: 'dist/public/libs',
    node: 'dist/app',
    public: 'dist/public',
    views: 'dist/public/views'

};

// -------------



// --- Testing, Linting, Etc ---

//Run jshint on our javascript files
gulp.task('jshint', function(){
    return gulp.src(paths.jshintPaths)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('doc', function (cb) {
    gulp.src(paths.jsdocPaths, {read: false})
        .pipe(jsdoc(cb));
});

// -----------------------------



// --- Move Tasks ---
gulp.task('favicon', function(){
    return gulp.src(sources.favicon)
    .pipe(gulp.dest(dest.public));
});

gulp.task('libs', function(){
    return gulp.src(sources.libs)
    .pipe(gulp.dest(dest.libs));
});

gulp.task('views', function(){
    return gulp.src(sources.views)
    .pipe(gulp.dest(dest.views));
});

gulp.task('server', function(){
    return gulp.src(sources.server)
    .pipe(gulp.dest(dest.dist));
});

gulp.task('node', function(){
    return gulp.src(sources.node)
    .pipe(gulp.dest(dest.node));
});

gulp.task('angularFiles', function(){
    return gulp.src(sources.angularFiles)
    .pipe(gulp.dest(dest.angularFiles));
});

//Move env file
gulp.task('env', function(){
    return gulp.src(sources.env)
    .pipe(gulp.dest(dest.env));
});

//Pick config.dev.js or config.prod.js
//Move and rename to config.js
gulp.task('config', function(){
    var src = 'config/config.'+environment+'.js';

    return gulp.src(src)
        .pipe(rename(dest.configName))
        .pipe(gulp.dest(dest.config));
});

gulp.task('frontEndConfig', function(){
    var src = sources.frontEndConfigs + 'config.' + environment + '.js';
    return gulp.src(src)
    .pipe(rename(dest.frontEndConfigName))
    .pipe(gulp.dest(dest.frontEndConfig));
});

gulp.task('move', ['favicon', 'libs', 'views', 'server', 'angularFiles', 'node', 'env',
    'config', 'frontEndConfig']);


// ------------------



// --- Compilation Tasks ---

//Set up index.html, injecting required js files
gulp.task('index', function(){
    return gulp.src(sources.index)
    .pipe(inject(
        series(
            gulp.src(sources.injectedJs, {read:false}),
            gulp.src(sources.appjs, {read:false})
        ),
        {relative:true}))
        .pipe(gulp.dest(dest.public));
});

gulp.task('sass', function(){
    return gulp.src(sources.sass)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(dest.css));
});

gulp.task('compile', ['index', 'sass']);

// -------------------------


gulp.task('build', ['compile', 'move']);


gulp.task('clean', function(){
    return gulp.src(dest.dist)
    .pipe(clean());
});

gulp.task('default', ['jshint', 'build']);

gulp.task('watch', function() {
    gulp.watch(sources.angularFiles, ['angularFiles']);
    gulp.watch(paths.config, ['config']);
    gulp.watch(sources.frontEndConfigs, ['frontEndConfig']);
    gulp.watch(sources.env, ['env']);
    gulp.watch(sources.index, ['index']);
    gulp.watch(sources.libs, ['libs']);
    gulp.watch(sources.node, ['node']);
    gulp.watch(sources.sass, ['sass']);
    gulp.watch(sources.server, ['server']);
    gulp.watch(sources.views, ['views']);
});

gulp.task('nodemon', function(){
    nodemon({
        script: 'dist/server.js'
    });
});

gulp.task('devrun', ['watch', 'nodemon']);
