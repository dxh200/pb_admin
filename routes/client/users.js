/*
* 客户端访问接口
* */
const express = require('express');
const router = express.Router();

router.get('/add-user',(req,res,next)=>{
    res.send("add-user")
})

module.exports = router;