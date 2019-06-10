const gulp = require('gulp');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

gulp.task('run', function () {
  let local = `${path.resolve()}\\lwpen.db`;
  //判断数据库文件是否存在,如果存在则删除
  if (fs.existsSync(local)) {
    fs.unlinkSync(local);
  }

  let db = new sqlite3.Database(local);

  db.serialize(function () {
    lw_pen_notes_table(db);
    lw_pen_problem_table(db);
    lw_pen_account_table(db);
    lw_pen_draw_table(db);
    lw_pen_config_table(db);
    lw_pen_local_table(db);
    lw_pen_logger_table(db);
    lw_pen_user_table(db);
    lw_pen_select_question(db);
    lw_pen_win_table(db);
  });
});
/**
 * 笔记表 lw_pen_notes
 * type '0为开始答题 1为开始自判 2为抢答'
 * status
 * @param {*} db
 */
function lw_pen_notes_table(db) {
  db.run(`
        create table if not exists lw_pen_notes
        (
            id integer primary key not null,batch nvarchar(100),
            createTime timestamp not null default current_timestamp,
            tag integer,len integer,
            packet_type integer,penid integer,
            pressure integer,x bigint,y bigint,
            penbox_vol integer,pen_vol integer,chk integer,
            questionId integer,classId integer,className nvarchar(100),
            bagId integer,analysis text,answer text,selectType integer,
            exerciseRecordId integer,
            content text,contentHtml text,type integer,autoGrade boolean
        )
    `);
}
/** 
 * 答题表 lw_pen_problem
 * type '0为开始答题 1为开始自判 2为抢答'
 * @param {*} db
 */
function lw_pen_problem_table(db) {
  db.run(`
        create table if not exists lw_pen_problem
        (
            id integer primary key not null,batch nvarchar(100),
            createTime timestamp not null default current_timestamp,
            tag integer,len integer,packet_type integer,
            sn integer,penid integer,penbox_vol integer,
            pen_vol integer,prob_num integer,prob integer,
            probNum nvarchar(100),probLetter nvarchar(100),
            chk integer,questionId integer,classId integer,
            className nvarchar(100),bagId integer,analysis text,selectType integer,
            exerciseRecordId integer,
            answer text,content text,contentHtml text,type integer,autoGrade boolean
        )
    `);
}

function lw_pen_select_question(db) {
  db.run(`
        create table if not exists lw_pen_select_question
        (
            id integer primary key not null,
            createTime timestamp not null default current_timestamp,
            questionId nvarchar(100),classId nvarchar(100),
            className nvarchar(100),bagId nvarchar(100),analysis text,
            answer text,content text,contentHtml text,type integer,autoGrade boolean,selectType integer
        )
    `);
}
/** 
 * 学生表 lw_pen_account
 * @param {*} db
 */
function lw_pen_account_table(db) {
  db.run(`
        create table if not exists lw_pen_account
        (
            account_id integer primary key not null,batch nvarchar(100),
            createTime timestamp not null default current_timestamp,
            name nvarchar(100),img_url text,gender integer,
            number nvarchar(100),type integer,is_temp integer,
            last_update_time nvarchar(100)
        )
    `);
}
/** 
 * 绘制表 lw_pen_draw
 * @param {*} db
 */
function lw_pen_draw_table(db) {
  db.run(`
    create table if not exists lw_pen_draw
    (
        id integer primary key not null,batch nvarchar(100),
        createTime timestamp not null default current_timestamp,
        penid nvarchar(100),questionId nvarchar(100),classId nvarchar(100),
        className nvarchar(100),bagId nvarchar(100),analysis text,
        answer text,content text,contentHtml text,
        imgPng text,imgJpg text,imgGif text
    )
`);
}
/** 
 * 状态表 lw_pen_config
 * questionsState 开始答题  0结束 1开始
 * selfJudgmentState 开始自判 0结束 1开始
 * grabQuestionState 抢答 0结束 1开始
 * @param {*} db
 */
function lw_pen_config_table(db) {
  db.run(`
        create table if not exists lw_pen_config
        (
            id integer primary key not null,
            createTime timestamp not null default current_timestamp,
            questionsState integer not null default 0,
            selfJudgmentState integer not null default 0,
            grabQuestionState integer not null default 0
        )
    `);
}
/** 
 * 缓存表 lw_pen_local
 * @param {*} db
 */
function lw_pen_local_table(db) {
  db.run(`
        create table if not exists lw_pen_local
        (
            id integer primary key not null,
            createTime timestamp not null default current_timestamp,
            keys text,vals text
        )
    `);
}
/**
 * 日志表 lw_pen_logger
 * @param {*} db
 */
function lw_pen_logger_table(db) {
  db.run(`
        create table if not exists lw_pen_logger
        (
            id integer primary key not null,title nvarchar(100),
            createTime timestamp not null default current_timestamp,
			message text,level nvarchar(100),className nvarchar(100),
			fileName nvarchar(100)			
        )
    `);
}

/**
 * 用户表
 * @param {*} db 
 */
function lw_pen_user_table(db) {
  db.run(`
        create table if not exists lw_pen_user
        (
            id integer primary key not null,
            accountName nvarchar(100),
            accountId nvarchar(100),
            password navarchar(100),
            gardenId nvarchar(100),
            LWToken nvarchar(100),
            userData text,
            classesArr text,
            createTime timestamp not null default current_timestamp
        )
    `);
}

function lw_pen_win_table(db) {
  db.run(`
    create table if not exists lw_pen_win
    (
        id integer primary key not null,
        key integer not null default 0,
        name nvarchar(100),
        createTime timestamp not null default current_timestamp
    )
  `);
}
