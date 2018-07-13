/**
 * 学习宣传分类数据模型
 */
const db = require('./../mongodb/db'),
    mongoose = db.mongoose;
const mongoosePaginate = require('mongoose-paginate');
const moment = require('moment');


const categorySchema = new mongoose.Schema({
    businessId:{type:String,default:""},   //业务系统id
    name:{type:String,default:""},         //分类名称
    photo:{type:String,default:""},        //分类图片
    remark:{type:String,default:""},       //备注
    num:{type:Number,default:0},           //阅读量
    type:{type:String,default:""},         //0同步、1手动
    status:{type:Number,default:1},        //状态1显示、0隐藏
    cTime:{type:Date},
    uTime:{type:Date}
},{
    versionKey: false,
    timestamps: { createdAt: 'cTime', updatedAt: 'uTime' }
});

//虚拟属性
categorySchema.virtual('type_name').get(function () {
    return this.type == 1 ? '手动' : '同步';
});
categorySchema.virtual('status_name').get(function () {
    return this.status == 1 ? '显示' : '隐藏';
});
categorySchema.virtual('cTimeFormat').get(function () {
    return moment(this.cTime).format('YYYY-MM-DD HH:mm');
});

//分页插件
categorySchema.plugin(mongoosePaginate);

categorySchema.statics.ObjectId = function(id) {
    return mongoose.Types.ObjectId(id);
}

module.exports = mongoose.model('PB_CATEGORY',categorySchema,"PB_CATEGORY");