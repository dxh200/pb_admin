"use strict";
const express = require('express');
const router = express.Router();
const settingApi = require('../../domains/api/settingApi');

router.get('/',(req,res)=>{
    res.json('设置数据 接口');
});

//设置数据api接口路由
router.post('/setOperation',settingApi.setOperation);



module.exports = router;