/**
 * 系统用户模型
 */
const db = require('./../mongodb/db'),
    mongoose = db.mongoose,
    baseSchema = db.baseSchema;

const userSchema = baseSchema.extend({
    ACCOUNT_:{type:String},  //账号
    PASSWORD_:{type:String}, //密码
    GENDER_:{type:String},   //性别
    NAME_:{type:String},     //姓名
    TEL_:{type:String},      //电话
    EMAIL:{type:String},     //email
    ADDRESS:{type:String},   //地址
    LOGIN_TIME_:{type:Date}  //登陆时间
});

module.exports = mongoose.model('PB_USERS',userSchema,"PB_USERS");