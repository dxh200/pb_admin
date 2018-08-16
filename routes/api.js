"use strict";
const express = require('express');
const router = express.Router();

//路由引用
const branchApiRouter = require('./api/branch');
const studyApiRouter = require('./api/study');
const workApiRouter = require('./api/work');
const newsApiRouter = require('./api/news');
const settingApiRouter = require('./api/setting');

router.get('/',(req,res,next)=>{

    res.json('API 接口');
})

//支部路由
router.use('/branch',branchApiRouter);
//学习宣传
router.use('/study',studyApiRouter);
//党务工作
router.use('/work',workApiRouter);
//关注热文
router.use('/news',newsApiRouter);
//设置数据
router.use('/setting',settingApiRouter);




module.exports = router;
