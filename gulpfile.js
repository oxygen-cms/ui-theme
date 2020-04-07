'use strict';

const { src, dest, parallel, watch } = require('gulp');
const    libsass         = require('gulp-sass');
const    prefix          = require('gulp-autoprefixer');
const    concat          = require('gulp-concat');
const    babel           = require('gulp-babel');
const    uglify          = require('gulp-uglify');
const    sourcemaps      = require('gulp-sourcemaps');
const    rename          = require('gulp-rename');
const    shell           = require('gulp-shell');
const    gulpUtil        = require('gulp-util');

const production = process.env.NODE_ENV == "production";

if(production) {
    console.log('Compiling for production');
}

/* ==============
        SCSS
   ============== */

function scss() {
    const sassOptions = {
        outputStyle: production ? 'compressed' : 'expanded'
    };

    return src('resources/scss/*.scss')
        .pipe(libsass(sassOptions))
        .pipe(prefix(
            'last 2 versions',
            'Explorer >= 10',
            'Safari >= 5'
        ))
        .pipe(production ? rename(function(path) { path.extname = '.min.css'; }) : gulpUtil.noop())
        .pipe(dest('public/css'));
}

/* ==============
         JS
   ============== */

function js() {
    return src(['resources/js/util.js', 'resources/js/Core/*.js', 'resources/js/Editor/*.js', 'resources/js/ImageEditor/*.js', 'resources/js/login.js', 'resources/js/app.js'], { base: 'resources/js' })
        .pipe(sourcemaps.init())
            .pipe(babel())
            .pipe(concat('app.js'))
            .pipe(production ? uglify() : gulpUtil.noop())
            .pipe(production ? rename(function(path) { path.extname = '.min.js'; }) : gulpUtil.noop())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('public/js'));
}

const vendor = shell.task([
        'mkdir -p public/vendor',
        // Modernizr
        'rsync -a resources/vendor/modernizr-2.8.3.min.js public/vendor/modernizr.min.js',
        // Ace
        'rsync -ar --delete node_modules/ace-builds/src-min/ public/vendor/ace',
        // Vex
        'mkdir -p public/vendor/vex',
        'rsync -a node_modules/vex-js/dist/js/vex.combined.min.js public/vendor/vex/vex.min.js',
        'rsync -a node_modules/vex-js/dist/css/vex.css public/vendor/vex/vex.css',

        // window.fetch polyfill
        'rsync -a node_modules/whatwg-fetch/fetch.js public/vendor/fetch.js',

        // Pace,
        'rsync -a node_modules/pace/pace.min.js public/vendor/pace.min.js',
        // JQuery
        'rsync -a node_modules/jquery/dist/jquery.min.js public/vendor/jquery.min.js',
        'rsync -a node_modules/jquery/dist/jquery.min.map public/vendor/jquery.min.map',
        // Smooth State
        'rsync -a node_modules/smoothstate/src/jquery.smoothState.js public/vendor/smoothState.js',
        'rsync -a node_modules/smoothstate/jquery.smoothState.min.js public/vendor/smoothState.min.js',
        // Headroom
        'rsync -a node_modules/headroom.js/dist/headroom.min.js public/vendor/headroom.min.js',
        // Tagging
        'rsync -a node_modules/taggingJS/tagging.min.js public/vendor/tagging.min.js',
        // CkEditor
        'mkdir -p public/vendor/ckeditor-skins',
        'rsync -ar --delete resources/vendor/ckeditor-skins/ public/vendor/ckeditor-skins',
        'rsync -ar --delete node_modules/ckeditor/ public/vendor/ckeditor',
        'rsync -ar --delete node_modules/CKEditor-ShowProtected-Plugin/showprotected/ public/vendor/ckeditor/plugins/showprotected',
        // JCrop
        'mkdir -p public/vendor/jcrop',
        'rsync -a node_modules/jcrop/js/Jcrop.min.js public/vendor/jcrop/jcrop.min.js',
        'rsync -a node_modules/jcrop/css/Jcrop.min.css public/vendor/jcrop/jcrop.min.css',
        'rsync -a node_modules/jcrop/css/Jcrop.gif public/vendor/jcrop/Jcrop.gif',
    ]);

exports.js = js;
exports.scss = scss;
exports.watch = function() {
    watch(
        'resources/scss/**/*.scss',
        scss
    );
    watch(
        'resources/js/**/*.js',
        js
    );
}
exports.default = parallel(js, scss, vendor);
