/*
* 数据库连接
* */
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

//链接字符串
const DB_URL = "mongodb://127.0.0.1:27017/pbAdmin";
//const DB_URL_USER_PASS = "mongodb://root:123456@127.0.0.1:27017/mall":
mongoose.connect(DB_URL);

mongoose.connection.on("connected",()=>{
    console.log("数据库链接成功");
})
mongoose.connection.on("error",(err)=>{
    console.log("数据库链接失败");
})
mongoose.connection.on("disconnected",()=>{
    console.log('Mongoose connection disconnected 链接断开');
})

module.exports = mongoose;