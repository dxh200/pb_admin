/**
 * 支部数据模型
 */
const db = require('./../mongodb/db'),
    mongoose = db.mongoose;


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

userSchema.statics.ObjectId = function(id) {
    return mongoose.Types.ObjectId(id);
}

module.exports = mongoose.model('PB_BRANCH',userSchema,"PB_BRANCH");