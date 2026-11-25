const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const { ESLint } = require('eslint');
const { dest } = require('gulp');

// Static build: everything compiles into source/dist and Browsersync serves it.
// When the templates move into the theme, set bases.dist to '../assets/' and
// every entry in out to '' (Shopify's assets folder is flat, no subfolders),
// and set maps to false so .map files don't end up in the theme.
const maps = true;

let bases = {
        app: 'assets/',
        dist: 'dist/'
    },
    out = {
        styles: 'styles/',
        scripts: 'scripts/',
        images: 'images/',
        fonts: 'fonts/'
    },
    paths = {
        scripts: [
            'js/custom/*.js'
        ],
        // Order matters. A library listed here must be installed (npm i <name>),
        // the build fails if one is missing. The Bootstrap bundle includes Popper.
        libs: [
            'node_modules/bootstrap/dist/js/bootstrap.bundle.js',
            'node_modules/@splidejs/splide/dist/js/splide.js',
            'node_modules/@splidejs/splide-extension-auto-scroll/dist/js/splide-extension-auto-scroll.js',
            // 'node_modules/numeral/min/numeral.min.js'
        ],
        styles: [
            'scss/screen.scss'
        ],
        // Font files: anything in assets/fonts, plus the weights we use from npm packages.
        // If you add a weight here, add it to scss/_configs/_fonts.scss too.
        fonts: [
            'assets/fonts/**/*.*',
            'node_modules/@fontsource/rubik/files/rubik-latin-400-normal.woff2',
            'node_modules/@fontsource/rubik/files/rubik-latin-400-italic.woff2',
            'node_modules/@fontsource/rubik/files/rubik-latin-500-normal.woff2',
            'node_modules/@fontsource/rubik/files/rubik-latin-600-normal.woff2'
        ],
        images: ['images/**/*.*', '!images/**/index.html']
    };

// Custom js lint (rules in eslint.config.js). Reports problems, never stops the build.
gulp.task('lint', async function() {
    const eslint = new ESLint({ errorOnUnmatchedPattern: false });
    const results = await eslint.lintFiles(paths.scripts.map(function(glob) {
        return bases.app + glob;
    }));
    const formatter = await eslint.loadFormatter('stylish');
    const output = await formatter.format(results);
    if (output) {
        console.log(output);
    }
});

// Custom js scripts minify
gulp.task('scripts', function() {
    return gulp.src(paths.scripts, { cwd: bases.app, allowEmpty: true, sourcemaps: maps })
        .pipe(uglify().on('error', function(e) {
            console.error('[scripts] ' + e.toString());
            this.emit('end');
        }))
        .pipe(concat('script.js'))
        .pipe(dest(bases.dist + out.scripts, { sourcemaps: maps ? '.' : false }));
});

// Js libraries combine
gulp.task('scripts_lib', function() {
    return gulp.src(paths.libs)
        .pipe(uglify({ output: { max_line_len: 120000 } }))
        .pipe(concat('lib.js'))
        .pipe(dest(bases.dist + out.scripts));
});

// CSS Combine and minify
gulp.task('styles', function() {
    return gulp.src(paths.styles, { cwd: bases.app, allowEmpty: true, sourcemaps: maps })
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('main.css'))
        .pipe(cleanCSS({ level: { 1: { specialComments: 0 } } }))
        .pipe(dest(bases.dist + out.styles, { sourcemaps: maps ? '.' : false }));
});

// Images copy (encoding: false keeps binary files intact on gulp 5)
gulp.task('images', function() {
    return gulp.src(paths.images, { cwd: bases.app, encoding: false })
        .pipe(dest(bases.dist + out.images));
});

// Fonts copy
gulp.task('fonts', function() {
    return gulp.src(paths.fonts, { encoding: false })
        .pipe(dest(bases.dist + out.fonts));
});

// Gulp Watch Task
gulp.task('watch', function() {
    gulp.watch('assets/scss/**/*.scss', gulp.series('styles', 'reload'));
    gulp.watch('assets/js/**/*.js', gulp.series('lint', 'scripts', 'reload'));
    gulp.watch('assets/images/**/*', gulp.series('images', 'reload'));
    gulp.watch('assets/fonts/**/*', gulp.series('fonts', 'reload'));
    gulp.watch('assets/static/**/*.html', gulp.series('reload'));
});

// Gulp Build Task
gulp.task('build', gulp.parallel(gulp.series('lint', 'scripts'), 'scripts_lib', 'styles', 'images', 'fonts'));

// Browser Sync: serves assets/static at http://localhost:8081/ with the build at /dist/
gulp.task('browserSyncInit', function() {
    browserSync.init({
        port: 8081,
        open: false,
        // Don't mirror scrolling, clicks and form input between connected browsers.
        // Pages still reload when files change.
        ghostMode: false,
        server: {
            baseDir: ['assets/static', '.']
        }
    });
});

gulp.task('reload', function(done) {
    browserSync.reload({});
    done();
});

gulp.task('default', gulp.series('build', gulp.parallel('browserSyncInit', 'watch')));
