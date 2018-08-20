"use strict";
const express = require('express');
const router = express.Router();
const workApi = require('../../domains/api/workApi');

router.get('/',(req,res)=>{
    res.json('党务工作 接口');
});

//党务工作api接口路由
router.post('/addContent',workApi.addContent);



module.exports = router;