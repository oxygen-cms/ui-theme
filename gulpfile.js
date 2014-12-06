var environment = "development";

console.log("\nEnvironment: " + environment + "\n");

var gulp            = require("gulp");

var libsass         = require("gulp-sass"),
    prefix          = require("gulp-autoprefixer"),
    concat          = require("gulp-concat"),
    coffee          = require("gulp-coffee"),
    uglify          = require("gulp-uglify"),
    stripDebug      = require("gulp-strip-debug"),
    changelog       = require("gulp-conventional-changelog"),
    shell           = require("gulp-shell"),
    notify          = require("gulp-notify");

/* ==============
        SCSS
   ============== */

gulp.task("scss", function() {
    sassOptions = {
        style: environment === "production" ? "compressed" : "compact",
        cacheLocation: "src/storage/sass-cache",
        cache: false,
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
            "Explorer >= 7",
            "Firefox >= 20",
            "Chrome >= 27",
            "Safari >= 5"
        ))
        .pipe(gulp.dest("public/css"))
        .pipe(notify({
            title: 'Compiled SCSS',
            subtitle: 'Success',
            message: "File: <%= file.relative %>",
            onLast: true
        }));
});

/* ==============
    CoffeeScript
   ============== */

gulp.task("coffee-concat", shell.task([
    "coffeescript-concat -I resources/coffee/core -I resources/coffee/pages -I resources/coffee/editor -I resources/coffee/imageEditor resources/coffee/main.coffee -o resources/coffee/build/output.coffee"
]));

gulp.task("coffee", ["coffee-concat"], function() {
    gulp.src("resources/coffee/build/output.coffee")
        .pipe(coffee())
        .pipe(gulp.dest("public/js"))
        .pipe(notify({
            title: 'Compiled CoffeeScript',
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
    // Headroom
    'rsync -a bower_components/headroom.js/dist/headroom.min.js public/vendor/headroom.min.js',
    // Tagging
    'rsync -a bower_components/taggingJS/tagging.js public/vendor/tagging.js',
    // CkEditor
    'mkdir -p public/vendor/ckeditor-skins',
    'rsync -ar --delete resources/vendor/ckeditor-skins public/vendor/ckeditor-skins',
    'rsync -ar --delete bower_components/ckeditor public/vendor',
    // JCrop
    'mkdir -p public/vendor/jcrop',
    'rsync -a bower_components/Jcrop/js/jquery.Jcrop.min.js public/vendor/jcrop/jcrop.min.js',
    'rsync -a bower_components/Jcrop/css/jquery.Jcrop.min.css public/vendor/jcrop/jcrop.min.css'
]));

/* ==============
        UTIL
   ============== */

gulp.task("publish-assets", shell.task([
    'php ../../../artisan asset:publish --bench="oxygen/ui"'
]));

gulp.task("publish-assets-quick", shell.task([
    'rsync -rp --delete public/js ../../../public_html/packages/oxygen/ui',
    'rsync -rp --delete public/css ../../../public_html/packages/oxygen/ui'
]));

gulp.task("watch", ["scss", "coffee", "publish-assets-quick"], function() {
    gulp.watch(
        "resources/scss/**/*.scss",
        ["scss", "publish-assets-quick"]
    );
    gulp.watch(
        [
            "resources/coffee/{core,editor,imageEditor,pages}/*",
            "resources/coffee/main.coffee"
        ],
        ["coffee", "publish-assets-quick"]
    );
});