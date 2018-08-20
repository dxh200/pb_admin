"use strict";
const express = require('express');
const router = express.Router();
const branchApi = require('../../domains/api/branchApi');

router.get('/',(req,res)=>{
    res.json('baranch 接口');
});

//支部api接口路由
router.post('/addBranch',branchApi.addBranch);
router.post('/addArchive',branchApi.addArchive);



module.exports = router;