var createError = require('http-errors');
var express = require('express');
var ejs = require('ejs')
var db = require('./mongodb/db')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var config = require('config-lite')(__dirname);

//引入路由
var adminRouter = require('./routes/admin');
var loginRouter = require('./routes/login');
var clientRouter = require('./routes/client')

var app = express();

//设置views路径和模板
app.set('views', path.join(__dirname, 'views'));
app.engine('html',ejs.__express);
app.set('view engine', 'html');

app.use(logger('dev'));

//表单数据解析
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//cookies
app.use(cookieParser());

//静态资源
app.use(express.static(path.join(__dirname, 'resources')));
app.use("/upload",express.static(path.join(__dirname, 'upload')));


//路由配置
app.use('/', loginRouter);
app.use('/admin', adminRouter);
app.use('/login', loginRouter);
app.use('/client', clientRouter);

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
