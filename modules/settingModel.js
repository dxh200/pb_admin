/**
 * 设置数据模型
 */
const db = require('./../mongodb/db'),
    mongoose = db.mongoose;
const mongoosePaginate = require('mongoose-paginate');
const moment = require('moment');


const settingSchema = new mongoose.Schema({
    key:{type:String,default:""},        //KEY
    val:mongoose.Schema.Types.Mixed,
    type:{type:String,default:""},        //0同步、1手动
    branchId:{type:String,default:""},    //支部ID
    cTime:{type:Date},
    uTime:{type:Date}
},{
    versionKey: false,
    timestamps: { createdAt: 'cTime', updatedAt: 'uTime' }
});

//虚拟属性
settingSchema.virtual('type_name').get(function () {
    return this.type == 1 ? '手动' : '同步';
});
settingSchema.virtual('cTimeFormat').get(function () {
    return moment(this.cTime).format('YYYY-MM-DD HH:mm');
});

//分页插件
settingSchema.plugin(mongoosePaginate);

settingSchema.statics.ObjectId = function(id) {
    return mongoose.Types.ObjectId(id);
}

module.exports = mongoose.model('PB_SETTINGS',settingSchema,"PB_SETTINGS");