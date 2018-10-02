/**
 * Created by Fakin on 2018/9/20.
 * 应用入口文件
 */
//加载express模块
const express = require('express');
//加载html模板
var ejs = require('ejs');
//加载
var moment = require('moment');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
//创建应用
const app = express();

//静态文件托管
app.use('/public', express.static(__dirname + '/public'));
app.use('/public/admin', express.static(__dirname + '/public/admin'));

//配置模板
app.set('views', './views');
app.set('view engine', 'ejs');
app.set('view cache', false);
app.use(bodyParser.json());
moment.locale('zh-cn');
app.locals.moment = moment;


app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cookieParser());


app.use(session({
    secret: '123',
    name: 'F-Blog',
    cookie: {
        maxAge: 1000000
    },
    resave: false,
    saveUninitialized: true
}));


// 允许跨域访问
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    res.type('html');
    next();
});
/*
 * 根据功能划分模块
 */

app.use('/admin', require('./routers/admin'));//后端模块路由
app.use('/', require('./routers/main'));//前端模块路由
app.use('/api', require('./routers/upload'));//图片路由

mongoose.connect('mongodb://localhost/27017', {useNewUrlParser: true}, function (err) {
    if (err) {
        console.log('数据库连接失败')
    } else {
        console.log('数据库连接成功');
        app.listen(8082);
    }
});
