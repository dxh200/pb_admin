"use strict";
/**
 * 党员基本数据模型
 */
const db = require('./../mongodb/db'),
    mongoose = db.mongoose;
const mongoosePaginate = require('mongoose-paginate');
const moment = require('moment');


const archiveSchema = new mongoose.Schema({
    name:{type:String,default:""},          //姓名
    headImg:{type:String,default:""},       //头像
    gender:{type:String,default:""},        //男女
    birthDate:{type:String,default:""},     //出生年月
    idCard:{type:String,default:""},        //身份证
    nation:{type:String,default:""},        //民族
    nativePlace:{type:String,default:""},   //籍贯
    marriage:{type:String,default:""},      //婚姻状况 0未婚1已婚
    registered:{type:String,default:""},    //户籍所在地
    residence:{type:String,default:""},     //现居住地
    mobile:{type:String,default:""},        //手机
    qqwX:{type:String,default:""},          //QQ微信
    ftEducation:{type:String,default:"1"},    //全日制教育[小学、初中、高中、大专、本科、硕士、博士]
    ftSchool:{type:String,default:""},      //毕业院校及专业

    swDate:{type:String,default:""},        //参加工作日期
    rdDate:{type:String,default:""},        //入党时间 ->大会接受预备党员日期
    zzDate:{type:String,default:""},        //转正时间 ->大会接受正式党员日期
    branchId:{type:String,default:""},      //现党支部
    branchDate:{type:String,default:""},    //进入现党支部时间
    position:{type:String,default:""},      //现党支部职务[1书记、2副书记、3委员、4普通党员]
    introducer:{type:String,default:""},    //入党介绍人
    rdSzzb:{type:String,default:""},        //入党所在支部
    zzSzzb:{type:String,default:""},        //转正所在支部
    work:{type:String,default:""},          //工作单位及职务
    orgUnit:{type:String,default:""},       //组织关系单位


    goodDeeds:{type:String,default:""},     //优秀事迹
    jcqk:{type:String,default:""},          //奖惩情况
    pyDate:{type:String,default:""},        //民主评议时间
    pyContent:{type:String,default:""},     //民主评议内容
    bType:{type:String,default:"5"},        //党员类型[1入党申请、2积极分子、3发展对象、4预备党员、5转正党员]
    good:{type:String,default:"0"},         //优秀党员工作者[1优秀党员、2优秀工作者]

    df:{type:String,default:""},            //党费
    type:{type:String,default:""},          //0同步、1手动
    status:{type:Number,default:1},         //状态1显示、0隐藏
    cTime:{type:Date},
    uTime:{type:Date},
    customTime:{type:String,default:""}
},{
    versionKey: false,
    timestamps: { createdAt: 'cTime', updatedAt: 'uTime' }
});

//虚拟属性

archiveSchema.virtual('position_name').get(function () {
    var eName = "";
    if(this.position == '1'){
        eName = "书记";
    }else if(this.position == '2'){
        eName = "副书记";
    }else if(this.position == '3'){
        eName = "委员";
    }else if(this.position == '4'){
        eName = "党员";
    }
    return eName;
});
archiveSchema.virtual('type_name').get(function () {
    return this.type == 1 ? '手动' : '同步';
});
archiveSchema.virtual('status_name').get(function () {
    return this.status == 1 ? '显示' : '隐藏';
});
archiveSchema.virtual('btype_name').get(function () {
    var eName = "";
    if(this.bType == '1'){
        eName = "入党申请";
    }else if(this.bType == '2'){
        eName = "积极分子";
    }else if(this.bType == '3'){
        eName = "发展对象";
    }else if(this.bType == '4'){
        eName = "预备党员";
    }else if(this.bType == '5'){
        eName = "转正党员";
    }
    return eName;
});
archiveSchema.virtual('ftEducation_name').get(function () {
    var eName = "";
    if(this.ftEducation == '1'){
        eName = "小学";
    }else if(this.ftEducation == '2'){
        eName = "初中";
    }else if(this.ftEducation == '3'){
        eName = "高中\中专";
    }else if(this.ftEducation == '4'){
        eName = "大专";
    }else if(this.ftEducation == '5'){
        eName = "本科";
    }else if(this.ftEducation == '6'){
        eName = "硕士";
    }else if(this.ftEducation == '7'){
        eName = "博士";
    }
    return eName;
});
archiveSchema.virtual('cTimeFormat').get(function () {
    return moment(this.cTime).format('YYYY-MM-DD HH:mm');
});

//分页插件
archiveSchema.plugin(mongoosePaginate);

archiveSchema.statics.ObjectId = function(id) {
    return mongoose.Types.ObjectId(id);
}

module.exports = mongoose.model('PB_ARCHIVE',archiveSchema,"PB_ARCHIVE");