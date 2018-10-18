
//declaration et appel des plugins
var gulp = require('gulp'),
    less = require('gulp-less'),
    sourcemaps = require('gulp-sourcemaps'),
    LessAutoprefix = require('less-plugin-autoprefix'),
    autoprefix = new LessAutoprefix({
        browsers: ['last 2 versions']
    }),
    jshint = require('gulp-jshint'),
    rename = require("gulp-rename"),
    htmlmin = require('gulp-htmlmin'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    plumber = require('gulp-plumber'),
    browserSync = require('browser-sync').create();



//task pour fichier less
gulp.task('less', function () {
    return gulp
    //recevoir le fichier main.less
    .src('./less/main.less') 
    //passer le fichier less par le autoprefixer   
    .pipe(less({
        plugins: [autoprefix]
    }))
    //initialiser la maps
    .pipe(sourcemaps.init())  
    //ajouter la maps  
    .pipe(sourcemaps.write())
    //placer le fichier CSS rendue dans la repertoire /css
    .pipe(gulp.dest('./css'))
    //minifier le fichier main.css
    .pipe(minifyCss())
    //minifier le fichier main.less par main.min.css
    .pipe(rename('main.min.css')) 
    //placer le fichier css minifier dans la repertoire /build/css
    .pipe(gulp.dest('./build/css'));
});



//task pour les fichiers JavaScript
gulp.task('scripts', function () {
    return gulp
    //recevoir tous les fichiers js
    .src(['./scripts/library.js','./scripts/main.js'])    
    //initialiser la maps
    .pipe(sourcemaps.init())  
    //plumber
    .pipe(plumber())
    //passer les fichiers js par jshint pour fixer les problemes des navigateurs
    .pipe(jshint({
        'esversion': 6
    }))
    .pipe(jshint.reporter('default'))
    //concatener les fichiers js dans un seule fichiers
    .pipe(concat("all.js"))
    //placer le fichier js dans la repertoire /js
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./js'))
    //minifier le fichier all.js
    .pipe(uglify()) 
    //renommer le fichiers all.js par all.min.js
    .pipe(rename('all.min.js')) 
    //placer le fichier js minifier dans la repertoire /build/js
    .pipe(gulp.dest('./build/js'))
});


//task pour les fichiers html
gulp.task('pages', function () {
    return gulp
    //recevoir tous les fichiers html
    .src(['./*.html'])
    //minifier les fichiers html
    .pipe(htmlmin({
        //suppression des espaces
        collapseWhitespace: true,
        //suppression des commentaires
        removeComments: true
    }))
    //placer les fichiers html dans la repertoire /build
    .pipe(gulp.dest('./build'));
});






// Static Server + watching less/js/html files
gulp.task('serve', ['less','scripts','pages'], function() {
    browserSync.init({
        server: "./build/",
        port:5500
        
    });

    gulp.watch('./less/main.less', ['less']).on('change', browserSync.reload)
    gulp.watch('./scripts/*.js', ['scripts']).on('change', browserSync.reload)
    gulp.watch("./*.html", ['pages']).on('change', browserSync.reload);
});


gulp.task('default', ['serve']);








/*
gulp.task('watch', function () {
    gulp.watch('./less/*.less', ['less'])
    .on('change', function (event) {    
        console.log(`Watch js: ${event.path} was ${event.type}.`);
    });
    gulp.watch('./scripts/*.js', ['scripts'])   
    gulp.watch('./*.html', ['pages'])    
});*/