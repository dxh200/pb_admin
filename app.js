var createError = require('http-errors');
var express = require('express');
var ejs = require('ejs')
var db = require('./mongodb/db');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var config = require('config-lite')(__dirname);
var ueditor = require('ueditor');
var moment = require('moment');

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
app.get('/a',(req,res,next)=>{
    res.render('index')
})
app.use('/', loginRouter);
app.use('/admin', adminRouter);
app.use('/login', loginRouter);
app.use('/client', clientRouter);

//ueditor
app.use("/ueditor/ue", ueditor(path.join(__dirname, 'resources'), function(req, res, next) {
    var date = moment().format('YYYYMMDD');
    var dirName = '/static';
    var imgDir = dirName+'/img/'+date+'/'; //默认上传地址为图片
    var ActionType = req.query.action;
    if (ActionType === 'uploadimage' || ActionType === 'uploadfile' || ActionType === 'uploadvideo' || ActionType === 'uploadscrawl') {
        var file_url = imgDir;//默认上传地址为图片
        /!*其他上传格式的地址*!/
        if (ActionType === 'uploadfile') {
            file_url = dirName+'/file/'+date+'/'; //附件保存地址
        }
        if (ActionType === 'uploadvideo') {
            file_url = dirName+'/video/'+date+'/'; //视频保存地址
        }
        res.ue_up(file_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
        res.setHeader('Content-Type', 'text/html');
    }
    //客户端发起图片列表请求
    else if (ActionType === 'listimage'){

        res.ue_list(imgDir);  // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/ueditor/ueditor.config.json')
    }
}));


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
