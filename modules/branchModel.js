/**
 * 支部数据模型
 */
const db = require('./../mongodb/db'),
    mongoose = db.mongoose;


const userSchema = new mongoose.Schema({
    BUSINESS_ID_:{type:String,default:""}, //业务系统id
    DIRECTOR_:{type:[String],default:[]},    //书记
    VICE_:{type:[String],default:[]},        //副书记
    NAME_:{type:String,default:""},        //支部名称
    PHOTO_:{type:String,default:""},       //封面
    ADDRESS_:{type:String,default:""},     //地址
    EMAIL_:{type:String,default:""},       //邮件
    SUMMARY_:{type:String,default:""},     //简介
    TYPE_:{type:String,default:""},         //0同步、1手动
    LOCATION_:{type:[Number],index:'2d',sparse: true,default:[0,0]},//位置
    STATUS:{type:Number,default:1},    //状态1显示、0隐藏
    CTIME_:{type:Date},
    UTIME_:{type:Date},
    CUSTOM_TIME_:{type:String,default:""}
},{
    versionKey: false,
    timestamps: { createdAt: 'CTIME_', updatedAt: 'UTIME_' }
});

userSchema.statics.ObjectId = function(id) {
    return mongoose.Types.ObjectId(id);
}

module.exports = mongoose.model('PB_BRANCH',userSchema,"PB_BRANCH");