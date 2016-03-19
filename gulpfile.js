var gulp            = require("gulp"),
    libsass         = require("gulp-sass"),
    prefix          = require("gulp-autoprefixer"),
    concat          = require("gulp-concat"),
    babel           = require("gulp-babel"),
    uglify          = require("gulp-uglify"),
    sourcemaps      = require("gulp-sourcemaps"),
    rename          = require('gulp-rename'),
    shell           = require("gulp-shell"),
    notify          = require("gulp-notify"),
    gulpUtil        = require('gulp-util');

var production = gulpUtil.env.production;

if(production) {
    console.log("Compiling for production");
}


/* ==============
        SCSS
   ============== */

gulp.task("scss", function() {
    sassOptions = {
        outputStyle: production ? "compressed" : "expanded",
        onError: function(err) {
            return notify().write({
                title: "SCSS Complilation Failed",
                subtitle: "Failed",
                message: err
            });
        }
    };

    return gulp.src("resources/scss/*.scss")
        .pipe(libsass(sassOptions))
        .pipe(prefix(
            "last 2 versions",
            "Explorer >= 9",
            "Safari >= 5"
        ))
        .pipe(production ? rename(function(path) { path.extname = ".min.css"; }) : gulpUtil.noop())
        .pipe(gulp.dest("public/css"))
        .pipe(notify({
            title: 'Compiled SCSS',
            subtitle: 'Success',
            message: "File: <%= file.relative %>",
            onLast: true
        }));
});

/* ==============
         JS
   ============== */

gulp.task("js", function() {
    return gulp.src("resources/js/**/*.js")
        .pipe(sourcemaps.init())
            .pipe(babel())
            .pipe(concat("app.js"))
            .pipe(production ? uglify() : gulpUtil.noop())
            .pipe(production ? rename(function(path) { path.extname = ".min.js"; }) : gulpUtil.noop())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("public/js"))
        .pipe(notify({
            title: 'Compiled JavaScript',
            subtitle: 'Success',
            message: "File: <%= file.relative %>",
            onLast: true
        }));
});

gulp.task("vendor", shell.task([
    'mkdir -p public/vendor',
    // Modernizr
    'rsync -a resources/vendor/modernizr-2.8.3.min.js public/vendor/modernizr.min.js',
    // Ace
    'rsync -ar --delete bower_components/ace-builds/src-min/ public/vendor/ace',
    // JQuery
    'rsync -a bower_components/jquery/dist/jquery.min.js public/vendor/jquery.min.js',
    'rsync -a bower_components/jquery/dist/jquery.min.map public/vendor/jquery.min.map',
    // Vex
    'mkdir -p public/vendor/vex',
    'rsync -a bower_components/vex/js/vex.combined.min.js public/vendor/vex/vex.min.js',
    'rsync -a bower_components/vex/css/vex.css public/vendor/vex/vex.css',
    // Pace,
    'rsync -a bower_components/pace/pace.min.js public/vendor/pace.min.js',
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
    // Babel Polyfill
    'mkdir -p public/vendor/babel-polyfill',
    'rsync -a node_modules/babel-polyfill/dist/polyfill.min.js public/vendor/babel-polyfill/polyfill.min.js'
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