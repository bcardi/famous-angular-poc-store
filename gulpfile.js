var gulp = require('gulp');
var clean = require('gulp-clean');
var tsc    = require('gulp-tsc');
var watch = require('glob-watcher');
var less = require('gulp-less-sourcemap');
var runseq = require('run-sequence');
var beep = require('beepbeep');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var zip = require('gulp-zip');
var webserver = require('gulp-webserver');
var minifyHTML = require('gulp-minify-html');
var minifyCSS = require('gulp-minify-css');
var pipeErrorStop = require('pipe-error-stop');
var karma = require('karma').server;
var install = require("gulp-install");
var debug=require('gulp-debug');
var ngAnnotate = require('gulp-ng-annotate');
var concat = require('gulp-concat');
var templateCache = require('gulp-angular-templatecache');


var onError = function (err) {
    beep([0, 0, 0]);
    gutil.log(gutil.colors.red(err));
};

function compileTS(src, out, dest) {
    gulp.src(src)
        .pipe(pipeErrorStop(tsc({
            sourcemap: true,
            declaration: true,
            logErrors: true,
            resolve: true,
            out: out
        })))
        .pipe(gulp.dest(dest));
}

function compileLESS(src, dest) {
    gulp.src(src)
        .pipe(less({
            generateSourceMap: true
        }))
        .pipe(gulp.dest(dest));
}

function annotate(src, dest) {
    gulp.src(src)
        .pipe(ngAnnotate())
        .pipe(gulp.dest(dest));
}

function startKarma(configFile, isSingleRun, done) {
    karma.start({
        configFile: __dirname + '/' + configFile,
        singleRun: isSingleRun
    }, done);
}

gulp.task('prepare',function(){
    gulp.src(['./bower.json', './package.json'])
        .pipe(install());
});

gulp.task('dev', function() {
    runseq('compile:typescript-dev','compile:css-dev');
    console.log("Now watching changes on the Typescript source files ...");
    watch(['app/**/*.ts','!app/**/*.d.ts'],function(event){
        console.log('compiling typescript...');
        runseq('compile:typescript-dev');
    });
    watch(['app/**/*.less'],function(event){
        console.log("Compiling LESS");
        runseq('compile:css-dev');
    });
    // NEED to add karma-tdd here to make sure karma runs on each and every save.
    // Its not enabled now as it will break the current non-TDD development.
    // When its time , you need to call , 'karma-tdd' along with server.
    runseq('server');
});

gulp.task("compile:typescript-dev",function() {
    compileTS('app/app.ts', 'app.js', 'app');
    compileTS('app/env.ts', 'env.js', 'app');

});

gulp.task("compile:css-dev",function(){
    compileLESS('app/**/*.less', 'app');
});

gulp.task('server',function(){
    console.log('Starting server on port 5555...');
    gulp.src('.')
        .pipe(webserver({
            livereload: false,
            directoryListing: false,
            open: false,
            port:5555,
            fallback:"index.html",
            host:"0.0.0.0"
        }));
});

gulp.task('karma', function (done) {
    startKarma('karma.conf.js', true, done);
});

gulp.task('karma-tdd', function (done) {
    startKarma('karma.conf.js', false, done);
});


gulp.task('default',function(cb){
    console.log("Starting the default task");
    runseq('dist:debug','uglify:js','uglify:html','uglify:css','clean:extraFiles',cb);
});

gulp.task('uglify:js',function() {
   return gulp.src(['dist/app/**/*.js'])
        //.pipe(uglify())
        .pipe(gulp.dest('dist/app'));
});

gulp.task('uglify:html',function() {
    return gulp.src('dist/**/*.html')
        .pipe(minifyHTML())
        .pipe(gulp.dest('dist'));
});

gulp.task('uglify:css',function() {
    return gulp.src('dist/app/*.css')
        .pipe(minifyCSS())
        .pipe(gulp.dest('dist/app'));
});

gulp.task('clean:extraFiles',function(){
 gulp.src(['dist/app/**/*.map'],{read:false})
        .pipe(clean({force:true}));
});

gulp.task('dist:debug',function(cb){
    console.log("Starting the dist-debug task");
    runseq('clean','compile:typescript','compile:less','dist',cb);
});

gulp.task('clean', function () {
    return gulp.src(['dist'], {read: false})
        .pipe(clean({force: true}));
});

gulp.task('compile:typescript',function(){
    console.log('Now compiling typescript...');
    compileTS('app/app.ts', 'app.js', 'dist/app');
});

gulp.task('compile:less',function(){
    compileLESS('app/app.less', 'dist/app');
});

gulp.task('minify:images', function() {
    return gulp.src('images/**')
        .pipe(imagemin({optimizationLevel: 5}))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('dist',function(){
    gulp.src('app/**/*.json').pipe(gulp.dest('dist/app'));
    gulp.src('app/**/*.html').pipe(gulp.dest('dist/app'));
    gulp.src('lib/**').pipe(gulp.dest('dist/lib'));
    gulp.src('images/**').pipe(gulp.dest('dist/images'));
    gulp.src('typings/**').pipe(gulp.dest('dist/typings'));
});

gulp.task('archive',function(){
    // Now zip up for easier distribution
    return gulp.src('dist/*')
        .pipe(zip('facility-web-services.zip'))
        .pipe(gulp.dest('dist'));
});

gulp.task('annotate:js', function () {
    annotate('dist/app/app.js', 'dist/app');
    annotate('dist/app/authentication/auth.js', 'dist/app/authentication');
    annotate('dist/app/env.js', 'dist/app');
    annotate('dist/login/login.js', 'dist/login');
});

//deployment to dev server. Pass 1. All hardcoded values now. TODO: Improvise and genaralize
// Need to perform a certificate based SSH on nacsatsadm

/*gulp.task('deploy:dev',function(cb){
    runseq('clean:archive','archive','dist:move','dist:remote-activate',cb);
});

gulp.task('dist:move',function(){
    return gulp.src('dist/ipp.zip')
        .pipe(sftp({host:'vlnacspoc1.atldev.com',user:'e1009878',pass:'Elastic!10',remotePath:'/home/e1009878/ipp'}));
});

gulp.task('dist:remote-activate',function(){
    gulpSSH = require('gulp-ssh')({
        ignoreErrors: false,
        sshConfig: {
            host: 'vlnacspoc1.atldev.com',
            port: 22,
            username: 'e1009878',
            password: 'Elastic!10'
        }
    });
    return gulpSSH
        .shell(['cd /var/www/nacs','rm -fr *','cp /home/e1009878/ipp/ipp.zip .','unzip ipp.zip','exit'], {filePath: 'shell.log'})
        .pipe(gulp.dest('logs'));
});*/

