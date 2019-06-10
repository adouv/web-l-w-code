const gulp = require('gulp');
const fs = require('fs');
const del = require('del');
const os = require('os');
let pathOutput = ['kanjie/nw.js/nwjs-v0.31.1-win-x64/lw-client/**/*', 'kanjie/nw.js/nwjs-v0.31.1-win-ia32/lw-client/**/*', 'kanjie/nw.js/nwjs-sdk-v0.31.1-win-x64/lw-client/**/*', 'kanjie/nw.js/nwjs-sdk-v0.31.1-win-ia32/lw-client/**/*'];
//复制编译后的文件
gulp.task('copy', function(done) {
    gulp.src('kanjie/FilesToInstall/lw-client/**/*')
        .pipe(gulp.dest('kanjie/nw.js/nwjs-v0.31.1-win-x64/lw-client/'))
        .pipe(gulp.dest('kanjie/nw.js/nwjs-v0.31.1-win-ia32/lw-client/'))
        .pipe(gulp.dest('kanjie/nw.js/nwjs-sdk-v0.31.1-win-x64/lw-client/'))
        .pipe(gulp.dest('kanjie/nw.js/nwjs-sdk-v0.31.1-win-ia32/lw-client/'));
});
//删除编译文件
gulp.task('dels', function(done) {
    del(pathOutput, done);
});
//总任务
gulp.task('run', ['dels', 'copy']);