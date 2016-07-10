var gulp            = require("gulp"),
    libsass         = require("gulp-sass"),
    prefix          = require("gulp-autoprefixer"),
    concat          = require("gulp-concat"),
    babel           = require("gulp-babel"),
    uglify          = require("gulp-uglify"),
    sourcemaps      = require("gulp-sourcemaps"),
    rename          = require('gulp-rename'),
    shell           = require("gulp-shell"),
    gulpUtil        = require('gulp-util');

var production = gulpUtil.env.release;

if(production) {
    console.log("Compiling for production");
}


/* ==============
        SCSS
   ============== */

gulp.task("scss", function() {
    sassOptions = {
        outputStyle: production ? "compressed" : "expanded"
    };

    return gulp.src("resources/scss/*.scss")
        .pipe(libsass(sassOptions))
        .pipe(prefix(
            "last 2 versions",
            "Explorer >= 10",
            "Safari >= 5"
        ))
        .pipe(production ? rename(function(path) { path.extname = ".min.css"; }) : gulpUtil.noop())
        .pipe(gulp.dest("public/css"));
});

/* ==============
         JS
   ============== */

gulp.task("js", function() {
    return gulp.src(["resources/js/util.js", "resources/js/Core/*.js", "resources/js/Editor/*.js", "resources/js/ImageEditor/*.js", "resources/js/login.js", "resources/js/app.js"], { base: 'resources/js' })
        .pipe(sourcemaps.init())
            .pipe(babel())
            .pipe(concat("app.js"))
            .pipe(production ? uglify() : gulpUtil.noop())
            .pipe(production ? rename(function(path) { path.extname = ".min.js"; }) : gulpUtil.noop())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("public/js"));
});

gulp.task("vendor", shell.task([
    'mkdir -p public/vendor',
    // Modernizr
    'rsync -a resources/vendor/modernizr-2.8.3.min.js public/vendor/modernizr.min.js',
    // Ace
    'rsync -ar --delete node_modules/ace-builds/src-min/ public/vendor/ace',
    // Vex
    'mkdir -p public/vendor/vex',
    'rsync -a node_modules/vex-js/js/vex.combined.min.js public/vendor/vex/vex.min.js',
    'rsync -a node_modules/vex-js/css/vex.css public/vendor/vex/vex.css',
    // Babel Polyfill
    'mkdir -p public/vendor/babel-polyfill',
    'rsync -a node_modules/babel-polyfill/dist/polyfill.min.js public/vendor/babel-polyfill/polyfill.min.js',
    // window.fetch polyfill
    'rsync -a node_modules/whatwg-fetch/fetch.js public/vendor/fetch.js',

    /// Legacy dependencies using bower... We should get rid of this.

    // Pace,
    'rsync -a node_modules/pace/pace.min.js public/vendor/pace.min.js',
    // JQuery
    'rsync -a bower_components/jquery/dist/jquery.min.js public/vendor/jquery.min.js',
    'rsync -a bower_components/jquery/dist/jquery.min.map public/vendor/jquery.min.map',
    // Smooth State
    'rsync -a bower_components/smoothstate-with-root-option/jquery.smoothState.min.js public/vendor/smoothState.js',
    // Headroom
    'rsync -a bower_components/headroom.js/dist/headroom.min.js public/vendor/headroom.min.js',
    // Tagging
    'rsync -a bower_components/taggingJS/tagging.js public/vendor/tagging.js',
    // CkEditor
    'mkdir -p public/vendor/ckeditor-skins',
    'rsync -ar --delete resources/vendor/ckeditor-skins/ public/vendor/ckeditor-skins',
    'rsync -ar --delete bower_components/ckeditor/ public/vendor/ckeditor',
    // JCrop
    'mkdir -p public/vendor/jcrop',
    'rsync -a bower_components/Jcrop/js/jquery.Jcrop.min.js public/vendor/jcrop/jcrop.min.js',
    'rsync -a bower_components/Jcrop/css/jquery.Jcrop.min.css public/vendor/jcrop/jcrop.min.css',
    'rsync -a bower_components/Jcrop/css/Jcrop.gif public/vendor/jcrop/Jcrop.gif',
]));

gulp.task("build", ["js", "scss", "vendor"]);

gulp.task("watch", ["scss", "js"], function() {
    gulp.watch(
        "resources/scss/**/*.scss",
        ["scss"]
    );
    gulp.watch(
        "resources/js/**/*.js",
        ["js"]
    );
});
