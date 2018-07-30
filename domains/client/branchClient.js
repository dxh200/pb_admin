"use strict";
const branchService = require('./../../service/branchService');
const archiveService = require('./../../service/archiveService');
const settingService = require('./../../service/settingService');
const ResultAjax = require('./../../utils/ResultAjax');
const baseClient = require('./baseClient');
const config = require('config-lite')(__dirname);


class BranchClient extends baseClient{

    constructor(){
        super();
        this.getBranchPersonnel = this.getBranchPersonnel.bind(this);
        this.getArchiveBTypeCount = this.getArchiveBTypeCount.bind(this);
        this.getArchiveGenderCount = this.getArchiveGenderCount.bind(this);
        this.getArchiveDlCount = this.getArchiveDlCount.bind(this);
        this.getArchiveEducationCount = this.getArchiveEducationCount.bind(this);
        this.getArchiveAgeCount = this.getArchiveAgeCount.bind(this);
    }

    /**
     * 根据id获得支部基本信息（名称、电话、地址、图片、简介）
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    async getBranchInfo(req,res){
        var id = req.query.id;
        branchService.findFieldById(id,"bName photo tel address summary",(err,data)=>{
            if(err){
                res.json(ResultAjax.ERROR(err.message,{}));
            }else{
                if(data){
                    res.json(ResultAjax.SUCCESS("",data));
                }else{
                    res.json(ResultAjax.FAILED("null",{}));
                }
            }
        });
    }

    /**
     * 2获得支部人员名称（书记、副书记）名称、头像
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    async getBranchPersonnel(req,res){
        var d1,d2 = [];
        try{
            var branchId = req.query.id;
            var sysDataDisplay = await this.getSysDataDisplay();
            var type = sysDataDisplay.val.d7;
            //获得书记、副书记
            d1 = await archiveService.find({status:1,type:type,branchId:branchId,position:{$in:['1','2']}},"name headImg position",{sort:{position:1}});
            //获得其他人员
            d2 = await archiveService.find({status:1,type:type,branchId:branchId,position:{$in:['3','4']}},"name headImg position",{sort:{position:1}});
            res.json(ResultAjax.SUCCESS("",{d1:d1,d2:d2}));
        }catch(err){
            res.json(ResultAjax.ERROR(err.message,{d1:d1,d2:d2}));
        }

    }

    //4获得统计信息
    /**
     * 4.1发展党员分布
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    async getArchiveBTypeCount(req,res){

        var aggregateOption = [];
        var resultData = config.pb_statistics.bType.val;
        try{
            var sysDataDisplay = await this.getSysDataDisplay();
            var type = sysDataDisplay.val.d10;
            if(type=='1'){
                var data = await settingService.getItem(config.pb_statistics.bType.key);
                if(!data){
                    data = config.pb_statistics.bType;
                }
                data.val.some((item)=>{delete item._id;});
                resultData = data.val;
            }else{
                aggregateOption.push({$group:{_id:'$bType',value:{$sum:1}}});
                var data = await archiveService.getArchiveAggregate(aggregateOption);
                resultData.forEach((_item)=>{
                    var _id = _item._id;
                    data.some((item)=>{
                        if(item._id==_id){
                            _item.value = item.value;
                            return true;
                        };
                    });
                    delete _item._id;
                });
            }
            res.json(ResultAjax.SUCCESS("",resultData));
        }catch(err){
            resultData.some((item)=>{delete item._id});
            res.json(ResultAjax.ERROR(err.message,resultData));
        }
    }
    //4.2党员性别分布[男女]
    async getArchiveGenderCount(req,res){
        var aggregateOption = [];
        var resultData = config.pb_statistics.gender.val;
        try{
            var sysDataDisplay = await this.getSysDataDisplay();
            var type = sysDataDisplay.val.d10;
            if(type=='1'){
                var data = await settingService.getItem(config.pb_statistics.gender.key);
                if(!data){
                    data = config.pb_statistics.gender;
                }
                resultData = data.val;
            }else{
                aggregateOption.push({$group:{_id:'$gender',value:{$sum:1}}});
                var data = await archiveService.getArchiveAggregate(aggregateOption);
                resultData.forEach((_item)=>{
                    let name = _item.name;
                    data.some((item)=>{
                        if(item._id==name){
                            _item.value = item.value;
                            return true;
                        };
                    });
                });
            }
            res.json(ResultAjax.SUCCESS("",resultData));
        }catch(err){
            res.json(ResultAjax.ERROR(err.message,resultData));
        }
    }

    /**
     * 4.3党员党龄分布[1-10年、11-20年、21-30年、31-40年、41-50年、50年以上]
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    async getArchiveDlCount(req,res){
        var resultData = config.pb_statistics.dl.val;
        try{
            var sysDataDisplay = await this.getSysDataDisplay();
            var type = sysDataDisplay.val.d10;
            if(type=='1'){
                var data = await settingService.getItem(config.pb_statistics.dl.key);
                if(!data){
                    data = config.pb_statistics.dl;
                }
                resultData = data.val;
            }else{
                var data = await archiveService.getDlCountClient(2);
                resultData.data = data;
            }

            res.json(ResultAjax.SUCCESS("",resultData));
        }catch(err){
            res.json(ResultAjax.ERROR(err.message,resultData));
        }
    }

    /**
     * 4.4党员学历分布
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    async getArchiveEducationCount(req,res){
        var aggregateOption = [];
        var resultData = config.pb_statistics.education.val;
        try{
            var sysDataDisplay = await this.getSysDataDisplay();
            var type = sysDataDisplay.val.d10;
            if(type=='1'){
                var data = await settingService.getItem(config.pb_statistics.education.key);
                if(!data){
                    data = config.pb_statistics.education;
                }
                resultData = data.val;
                resultData.some((item)=>{delete item._id;});
            }else{
                aggregateOption.push({$group:{_id:'$ftEducation',value:{$sum:1}}});
                var data = await archiveService.getArchiveAggregate(aggregateOption);
                resultData.forEach((_item)=>{
                    var _id = _item._id;
                    data.some((item)=>{
                        if(item._id==_id){
                            _item.value = item.value;
                            return true;
                        };
                    });
                    delete _item._id;
                });
            }
            res.json(ResultAjax.SUCCESS("",resultData));
        }catch(err){
            resultData.some((item)=>{delete item._id});
            res.json(ResultAjax.ERROR(err.message,resultData));
        }
    }

    //4.5党员年龄分布[25岁以下、26-35岁、36-45岁、46-55岁、56岁以上]
    async getArchiveAgeCount(req,res){
        var resultData = config.pb_statistics.age.val;
        try{
            var sysDataDisplay = await this.getSysDataDisplay();
            var type = sysDataDisplay.val.d10;
            if(type=='1'){
                var data = await settingService.getItem(config.pb_statistics.age.key);
                if(!data){
                    data = config.pb_statistics.age;
                }
                resultData = data.val;
            }else{
                var data = await archiveService.getAgeCountClient(2);
                resultData.data = data;
            }
            res.json(ResultAjax.SUCCESS("",resultData));
        }catch(err){
            res.json(ResultAjax.ERROR(err.message,resultData));
        }
    }

    /**
     * 查看人员基本信息
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    async getArchiveInfo(req,res){
        var id = req.query.id;
        var resultData = {};
        archiveService.findById(id,(err,data)=>{
           if(err){
               res.json(ResultAjax.ERROR(err.message,resultData));
           }else{
               if(data){
                   res.json(ResultAjax.SUCCESS("",data));
               }else{
                   res.json(ResultAjax.ERROR("",resultData));
               }
           }
        });
    }

}

module.exports = new BranchClient();