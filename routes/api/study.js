"use strict";
const express = require('express');
const router = express.Router();
const studyApi = require('../../domains/api/studyApi');

router.get('/',(req,res)=>{
    res.json('学习宣传 接口');
});

//学习宣传api接口路由
router.post('/addCategory',studyApi.addCategory);
router.post('/addContent',studyApi.addContent);



module.exports = router;