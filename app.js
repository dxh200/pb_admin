var createError = require('http-errors');
var express = require('express');
var db = require('./mongodb/db')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var config = require('config-lite')(__dirname);

//引入路由
var MainRouter = require('./routes/admin');
var LoginRouter = require('./routes/login');
var ClientRouter = require('./routes/client')

var app = express();

//设置views路径和模板
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));

//表单数据解析
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//cookies
app.use(cookieParser());

//静态资源
app.use(express.static(path.join(__dirname, 'resources')));
app.use(express.static(path.join(__dirname, 'upload')));

//路由配置
app.use('/', MainRouter);
app.use('/login', LoginRouter);
app.use('/client', ClientRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
