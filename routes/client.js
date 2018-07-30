/*
* 客户端访问接口
* */
const express = require('express');
const router = express.Router();
const ResultAjax = require('./../utils/ResultAjax');

const users = require('./client/users');
const home = require('./client/home');
const branch = require('./client/branch');
const content = require('./client/content');

router.get('/',(req,res,next)=>{

    res.json(ResultAjax.SUCCESS("",{}));
})

router.use('/home',home);
router.use('/branch',branch);
router.use('/content',content);
router.use('/users',users);

module.exports = router;