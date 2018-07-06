/*
* 客户端访问接口
* */
const express = require('express');
const router = express.Router();

router.get('/add-user1',(req,res,next)=>{
    console.log(req.body.dxh);
    res.send("add-user")
})

router.post('/add-user',(req,res,next)=>{
    console.log(req.body.dxh);
    res.send("add-user-post")
})

module.exports = router;