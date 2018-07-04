/**
 * 支部数据模型
 */
const db = require('./../mongodb/db'),
    mongoose = db.mongoose,
    baseSchema = db.baseSchema;

const userSchema = baseSchema.extend({
    BUSINESS_ID_:{type:String,unique:true}, //业务系统id
    NAME_:{type:String},        //支部名称
    PHOTO_:{type:String},       //封面
    ADDRESS_:{type:String},     //地址
    EMAIL_:{type:String},       //邮件
    SUMMARY_:{type:String},     //简介
    TYPE_:{type:String},         //0同步、1手动
    LOCATION_:{type:Number,index:'2d',sparse: true},//位置
    STATUS:{type:Number}    //状态1显示、0隐藏
});

module.exports = mongoose.model('PB_BRANCH',userSchema,"PB_BRANCH");