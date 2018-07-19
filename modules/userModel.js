/**
 * 系统用户模型
 */
const db = require('./../mongodb/db'),
    mongoose = db.mongoose;
const mongoosePaginate = require('mongoose-paginate');
const moment = require('moment');

const userSchema = new mongoose.Schema({
    account:{type:String,default:''},  //账号
    password:{type:String,default:''}, //密码
    headImg:{type:String,default:''},
    gender:{type:String,default:''},   //性别
    name:{type:String,default:''},     //姓名
    tel:{type:String,default:''},      //电话
    email:{type:String,default:''},     //email
    address:{type:String,default:''},   //地址
    ctime:{type:Date},
    utime:{type:Date},
    loginTime:{type:Date,default:new Date()},  //最后登陆时间
    lastTime:{type:Date,default:new Date()}    //最近登录时间
},{
    versionKey: false,
    timestamps: { createdAt: 'cTime', updatedAt: 'uTime' }
});

userSchema.virtual('cTimeFormat').get(function () {
    return moment(this.cTime).format('YYYY-MM-DD HH:mm');
});

//分页插件
userSchema.plugin(mongoosePaginate);

userSchema.statics.ObjectId = function(id) {
    return mongoose.Types.ObjectId(id);
}

module.exports = mongoose.model('PB_USERS',userSchema,"PB_USERS");