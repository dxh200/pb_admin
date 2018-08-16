"use strict";
const express = require('express');
const router = express.Router();
const newsApi = require('../../domains/api/newsApi');

router.get('/',(req,res)=>{
    res.json('关注热文 接口');
});

//关注热文api接口路由
router.post('/addContent',newsApi.addContent);



module.exports = router;