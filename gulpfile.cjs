const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const debug = require('gulp-debug');
const rename = require('gulp-rename');
const del = require('del');
const minifyCss = require('gulp-clean-css');
const terser = require('gulp-terser');
const argv = require('yargs').argv;

var buildDir = 'public/assets';
var assetsDir = 'resources/assets';

var scssFiles = [
    assetsDir + '/scss/app.scss'
];

var setupScssFiles = [
    assetsDir + '/setup/setup.scss'
];

var jsFiles = [
    assetsDir + '/js/*.js',
    assetsDir + '/js/**/*.js',
];

var vendorJsFiles = [
    'node_modules/jquery/dist/jquery.js',
    'node_modules/@popperjs/core/dist/umd/popper.js',
    'node_modules/bootstrap/dist/js/bootstrap.js',
    'node_modules/moment/moment.js',
    'node_modules/moment/locale/pt-br.js',

    // ws
    'node_modules/laravel-echo/dist/echo.iife.js',
    'node_modules/pusher-js/dist/web/pusher.js',
];

var vendorCssFiles = [
    'node_modules/animate.css/animate.css',
];

// ---------------------------------------------------------------------------------------------------
// Copy assets

function copyAssets(files, dest) {

    return gulp.src(files, { cwd: assetsDir })
        .pipe(gulp.dest(buildDir + '/' + dest));
}

function copyFonts() {
    return copyAssets('fonts/**/*.woff2', 'fonts');
}

function copyImages() {
    return copyAssets('img/**/*', 'img');
}

// ---------------------------------------------------------------------------------------------------
// Css

function cssTasks(files, outputName, env = 'dev') {

    var obj = gulp.src(files)
        .pipe(debug({ title: 'css-debug' }))
        .pipe(concat(outputName + '.scss'))
        .pipe(sass({
            outputStyle: env == 'prod' ? 'compressed' : 'expanded'
        }).on('error', sass.logError))
        .pipe(rename(outputName + '.min.css'));

    if (env == 'prod') {
        obj.pipe(minifyCss({ compatibility: 'ie8' }));
    }

    return obj.pipe(gulp.dest(buildDir + '/css'));
}

function cssDev() {
    return cssTasks(scssFiles, 'styles');
}

function cssProd() {
    return cssTasks(scssFiles, getVersionedName('styles'), 'prod');
}

function setupCssDev() {
    return cssTasks(setupScssFiles, 'setup');
};

function setupCssProd() {
    return cssTasks(setupScssFiles, getVersionedName('setup'), 'prod');
}

function vendorCssDev() {
    return cssTasks(vendorCssFiles, 'vendor');
}

function vendorCssProd() {
    return cssTasks(vendorCssFiles, getVersionedName('vendor'), 'prod');
}

// ---------------------------------------------------------------------------------------------------
// Js

function jsTasks(files, outputName, env = 'dev') {

    var obj = gulp.src(files)
        .pipe(debug({ title: 'js-debug' }))
        .pipe(concat(outputName + '.js'));

    if (env == 'prod') {
        obj = obj.pipe(terser({
            output: { comments: false }
        }));
    }

    return obj.pipe(rename(outputName + '.min.js'))
        .pipe(gulp.dest(buildDir + '/js'));
}

function jsDev() {
    return jsTasks(jsFiles, 'scripts');
}

function jsProd() {
    return jsTasks(jsFiles, getVersionedName('scripts'), 'prod');
}

function vendorJsDev() {
    return jsTasks(vendorJsFiles, 'vendor');
}

function vendorJsProd() {
    return jsTasks(vendorJsFiles, getVersionedName('vendor'), 'prod');
}

// ---------------------------------------------------------------------------------------------------
// Função de versionamento

/**
 * Obtem o nome do arquivo de saída versionado
 * @param {*} name
 * @returns
 */
function getVersionedName(name) {

    if (argv.tag && argv.tag !== true) {
        name = name + '-' + argv.tag;
    }

    return name;
}

// ---------------------------------------------------------------------------------------------------
// Tasks avulsas

/**
 * Monitora a alteração e realiza a publicação dos arquivos
 * @returns
 */
function watch() {

    gulp.watch(assetsDir + '/scss/**/*.scss', cssDev);

    gulp.watch(assetsDir + '/setup/**/*.scss', setupCssDev);

    gulp.watch(assetsDir + '/fonts/**/*', copyFonts);

    gulp.watch(assetsDir + '/img/**/*', copyImages);

    gulp.watch(assetsDir + '/js/**/*.js', jsDev);
}

gulp.task('clean', function () {
    return del([buildDir]);
});

gulp.task('build', gulp.series(
    'clean',
    cssProd,
    setupCssProd,
    jsProd,
    vendorCssProd,
    vendorJsProd,
    copyImages,
    copyFonts,
));

gulp.task('default', gulp.series(
    'clean',
    cssDev,
    setupCssDev,
    jsDev,
    vendorCssDev,
    vendorJsDev,
    copyImages,
    copyFonts,
));

gulp.task('watch', gulp.series('default', watch));