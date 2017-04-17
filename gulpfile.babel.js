import gulp from 'gulp';
import watch from 'gulp-watch';
import uglify from 'gulp-uglify';
import babel from 'gulp-babel';
import sass from 'gulp-sass';
import sourcemap from 'gulp-sourcemaps';
import prefixer from 'gulp-autoprefixer';
import cssmin from 'gulp-minify-css';
import browserSync from 'browser-sync';
import del from 'del';
import babelify from 'babelify';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
let clean = require('gulp-rimraf');
import gutil from 'gulp-util';
const mocha = require('gulp-mocha');

let reload = browserSync.reload;

gulp.task('js', function () {
    return browserify({
            entries: './src/js/index.js',
            debug: true
        })
        .transform(babelify.configure({
            presets: ["es2015"],
            sourceMaps: true
        }))
        .bundle()
        .on('error', function (err) { console.error(err); })
        .pipe(source('./index.js'))
        .pipe(buffer())
        .pipe(sourcemap.init())
        //.pipe(uglify())
        .pipe(sourcemap.write('./'))
        /*'.', {sourceMappingURLPrefix: '/js'} *//*, {sourceMappingURLPrefix: 'build'}*/
        .pipe(gulp.dest('./build/js')) 
        .pipe(reload({stream: true}));
});

gulp.task('sass', function () {
    return gulp.src('src/style/*.scss')
        .pipe(sourcemap.init())
        .pipe(sass())
        .pipe(prefixer({
            browsers: ['last 3 versions']
        }))
        .pipe(cssmin())
        .pipe(sourcemap.write())
        .pipe(gulp.dest('build/css/'))
        .pipe(reload({stream: true}));
});

gulp.task('html', function () {
    return gulp.src('src/**/*.html')
        .pipe(gulp.dest('build/'))
        .pipe(reload({stream: true}));
});

gulp.task('clean', [], function() {
    //console.log("Clean all files in build folder");
    //return gulp.src("build/*", { read: false }).pipe(clean());
});

gulp.task('build', ['clean', 'html', 'sass', 'js']);

gulp.task('watch', function () {
    watch('src/**/*.html', function () {
        gulp.start('html');
    });

    watch('src/style/**/*.scss', function () {
        gulp.start('sass');
    });

    watch('src/js/**/*.js', function () {
        gulp.start('js');
    });
});

gulp.task('webserver', function () {
    return browserSync({
        server: {
            baseDir: "./build"
        },
        host: 'localhost',
        port: 8080,
        logPrefix: 'Front_Scheduler'
    })
});

gulp.task('test', function() {
    return gulp.src(['test/*.js'])
        .pipe(mocha({
            compilers: babel
        }));
});

gulp.task('default', ['build', 'webserver', 'watch']);