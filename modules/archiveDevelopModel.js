"use strict";
/**
 * 发展党员信息
 */

const db = require('./../mongodb/db'),
    mongoose = db.mongoose;

const archiveDevelopSchema = new mongoose.Schema({
    archiveId:{type:String,default:""},
    data1:{type:String,default:""},          //入党申请
    data2:{type:String,default:""},          //党组谈话
    data3:{type:String,default:""},          //确定入党积极分子
    data4:{type:String,default:""},          //上级党委备案
    data5:{type:String,default:""},          //指定培养联系人
    data6:{type:String,default:""},          //培养教育考察
    data7:{type:String,default:""},          //确定发展对象
    data8:{type:String,default:""},          //上级党委备案
    data9:{type:String,default:""},          //确定入党介绍人
    data10:{type:String,default:""},         //进行整治审查
    data11:{type:String,default:""},         //开展集中培训
    data12:{type:String,default:""},         //部委员会审核
    data13:{type:String,default:""},          //上级党委预审
    data14:{type:String,default:""},        //填写入党志愿书
    data15:{type:String,default:""},         //支部大会讨论
    data16:{type:String,default:""},        //上级党委派人谈话
    data17:{type:String,default:""},        //上级党委审批
    data18:{type:String,default:""},        //再上一级党委组织部门备案
    data19:{type:String,default:""},        //编入党支部和党小组
    data20:{type:String,default:""},        //入党宣誓
    data21:{type:String,default:""},        //继续教育考察
    data22:{type:String,default:""},        //提出转正申请
    data23:{type:String,default:""},        //支部大会讨论
    data24:{type:String,default:""},        //上级党委审批
    data25:{type:String,default:""},        //材料归档

    /**
     * {currentStage:1,state:11,data:[
	        data1:{status:1,date:2018-02-08}
       ]}
     currentStage:1入党申请、2积极分子、3发展对象、4预备党员、5预备党员考察和转正
     state:每个阶段内容1-25
     data:每个阶段内容状态【0默认、1通过】、时间
     */
    params:mongoose.Schema.Types.Mixed,         //

    cTime:{type:Date},
    uTime:{type:Date},
},{
    versionKey: false,
    timestamps: { createdAt: 'cTime', updatedAt: 'uTime' }
});

archiveDevelopSchema.virtual('cTimeFormat').get(function () {
    return moment(this.cTime).format('YYYY-MM-DD HH:mm');
});

archiveDevelopSchema.statics.ObjectId = function(id) {
    return mongoose.Types.ObjectId(id);
}

module.exports = mongoose.model('PB_ARCHIVE_DEVELOP',archiveDevelopSchema,"PB_ARCHIVE_DEVELOP");