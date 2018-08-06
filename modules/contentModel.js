/**
 * 支部数据模型
 */
const db = require('./../mongodb/db'),
    mongoose = db.mongoose;
const mongoosePaginate = require('mongoose-paginate');
const moment = require('moment');


const contentSchema = new mongoose.Schema({
    title:{type:String,default:""},          //标题
    photo:{type:String,default:""},          //封面
    source:{type:String,default:""},         //来源
    author:{type:String,default:""},         //作者
    summary:{type:String,default:""},        //简介
    module:{type:String,default:""},         //模块【1学习宣传、2党务工作、3关注热文】
    category:{type:String,default:""},       //分类->对应各个模块
    num:{type:Number,default:0},             //访问量
    content:{type:String,default:""},        //内容
    type:{type:String,default:""},           //0同步、1手动
    status:{type:Number,default:1},          //状态1显示、0隐藏
    cTime:{type:Date},
    uTime:{type:Date},
    customTime:{type:String,default:""}
},{
    versionKey: false,
    timestamps: { createdAt: 'cTime', updatedAt: 'uTime' }
});

//虚拟属性
contentSchema.virtual('type_name').get(function () {
    return this.type == 1 ? '手动' : '同步';
});
contentSchema.virtual('status_name').get(function () {
    return this.status == 1 ? '显示' : '隐藏';
});
contentSchema.virtual('cTimeFormat').get(function () {
    return moment(this.cTime).format('YYYY-MM-DD HH:mm');
});

//分页插件
contentSchema.plugin(mongoosePaginate);

contentSchema.statics.ObjectId = function(id) {
    return mongoose.Types.ObjectId(id);
}

module.exports = mongoose.model('PB_CONTENT',contentSchema,"PB_CONTENT");