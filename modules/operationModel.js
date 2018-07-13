/**
 * 运营数据模型
 */
const db = require('./../mongodb/db'),
    mongoose = db.mongoose;
const mongoosePaginate = require('mongoose-paginate');
const moment = require('moment');


const operationSchema = new mongoose.Schema({
    name:{type:String,default:""},        //支部名称
    tName:{type:String,default:""},       //默认为：发起率、参与率
    data:{type:String,default:""},       //统计数据
    type:{type:String,default:""},        //0同步、1手动
    cTime:{type:Date},
    uTime:{type:Date}
},{
    versionKey: false,
    timestamps: { createdAt: 'cTime', updatedAt: 'uTime' }
});

//虚拟属性
operationSchema.virtual('type_name').get(function () {
    return this.type == 1 ? '手动' : '同步';
});
operationSchema.virtual('cTimeFormat').get(function () {
    return moment(this.cTime).format('YYYY-MM-DD HH:mm');
});

//分页插件
operationSchema.plugin(mongoosePaginate);

operationSchema.statics.ObjectId = function(id) {
    return mongoose.Types.ObjectId(id);
}

module.exports = mongoose.model('PB_OPERATION',operationSchema,"PB_OPERATION");