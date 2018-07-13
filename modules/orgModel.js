/**
 * 基层组织数据模型
 */
const db = require('./../mongodb/db'),
    mongoose = db.mongoose;
const mongoosePaginate = require('mongoose-paginate');
const moment = require('moment');


const orgSchema = new mongoose.Schema({
    name:{type:String,default:""},        //名称
    remark:{type:String,default:""},      //来源
    type:{type:String,default:""},        //0同步、1手动
    status:{type:Number,default:1},       //状态1显示、0隐藏
    cTime:{type:Date},
    uTime:{type:Date},
    bId:{type:mongoose.Schema.ObjectId,ref:'PB_BRANCH'},         //支部名称与PB_BRANCH表关联
},{
    versionKey: false,
    timestamps: { createdAt: 'cTime', updatedAt: 'uTime' }
});




//虚拟属性
orgSchema.virtual('type_name').get(function () {
    return this.type == 1 ? '手动' : '同步';
});
orgSchema.virtual('status_name').get(function () {
    return this.status == 1 ? '显示' : '隐藏';
});
orgSchema.virtual('cTimeFormat').get(function () {
    return moment(this.cTime).format('YYYY-MM-DD HH:mm');
});

//分页插件
orgSchema.plugin(mongoosePaginate);

orgSchema.statics.ObjectId = function(id) {
    return mongoose.Types.ObjectId(id);
}

module.exports = mongoose.model('PB_ORG',orgSchema,"PB_ORG");