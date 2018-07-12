/**
 * 支部数据模型
 */
const db = require('./../mongodb/db'),
    mongoose = db.mongoose;
const mongoosePaginate = require('mongoose-paginate');
const moment = require('moment');


const userSchema = new mongoose.Schema({
    businessId:{type:String,default:""},   //业务系统id
    director:{type:[String],default:[]},    //书记
    vice:{type:[String],default:[]},        //副书记
    bName:{type:String,default:""},        //支部名称
    photo:{type:String,default:""},       //封面
    tel:{type:String,default:""},         //电话
    address:{type:String,default:""},     //地址
    email:{type:String,default:""},       //邮件
    summary:{type:String,default:""},     //简介
    type:{type:String,default:""},         //0同步、1手动
    location:{type:[Number],index:'2d',sparse: true,default:[0,0]},//位置
    status:{type:Number,default:1},    //状态1显示、0隐藏
    cTime:{type:Date},
    uTime:{type:Date},
    customTime:{type:String,default:""}
},{
    versionKey: false,
    timestamps: { createdAt: 'cTime', updatedAt: 'uTime' }
});

//虚拟属性
userSchema.virtual('type_name').get(function () {
    return this.type == 1 ? '手动' : '同步';
});
userSchema.virtual('status_name').get(function () {
    return this.status == 1 ? '显示' : '隐藏';
});
userSchema.virtual('cTimeFormat').get(function () {
    return moment(this.cTime).format('YYYY-MM-DD HH:mm');
});

//分页插件
userSchema.plugin(mongoosePaginate);

userSchema.statics.ObjectId = function(id) {
    return mongoose.Types.ObjectId(id);
}

module.exports = mongoose.model('PB_BRANCH',userSchema,"PB_BRANCH");