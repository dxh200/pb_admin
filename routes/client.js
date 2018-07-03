/*
* 客户端访问接口
* */
const express = require('express');
const router = express.Router();

const users = require('./client/users')

router.get('/',(req,res,next)=>{
    res.send("client")
})

router.use('/users',users);

module.exports = router;