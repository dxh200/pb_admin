const ArchiveModel = require('./../modules/archiveModel');
const config = require('config-lite')(__dirname);
const moment = require('moment');

/**
 * 党员信息业务管理
 */
class ArchiveService{
    constructor(){
        this.getArchiveGoodCountClient = this.getArchiveGoodCountClient.bind(this);
        this.getAgeCountClient = this.getAgeCountClient.bind(this);
    }

    /**
     * 添加
     * @param option   模型数据
     * @param callback 回调err,data
     * @returns {Promise<void>}
     */
    async addArchive(option,callback){
        let archiveModel = new ArchiveModel(option);
        await archiveModel.save((err,data)=>{
            if(callback){
                callback(err,null);
            }else{
                callback(null,data);
            }
        })
    }

    /**
     * 编辑数据
     * @param id       数据id
     * @param options  数据模型
     * @param callback err
     * @returns {Promise<void>}
     */
    async updateArchive(id,options,callback){
        let _id = ArchiveModel.ObjectId(id);
        await ArchiveModel.update({"_id":_id},{$set:options},(err,raw)=>{
            if(err){
                callback(err);
            }else{
                callback(null);
            }
        });
    }

    /**
     * 删除数据
     * @param id
     * @param callback
     * @returns {Promise<void>}
     */
    async delArchive(id,callback){
        let _id = ArchiveModel.ObjectId(id);
        await ArchiveModel.deleteOne({"_id":_id},(err)=>{
            if(err){
                callback(err);
            }else{
                callback(null);
            }
        })
    }

    /**
     * 根据id查询支部数据
     * @param id
     * @param callback
     * @returns {Promise<void>}
     */
    async findById(id,callback){
        let _id = ArchiveModel.ObjectId(id);
        await ArchiveModel.findOne(_id,(err,data)=>{
            if(err){
                callback(err,null);
            }else{
                if(data){
                    callback(null,data)
                }

            }
        })
    }

    /**
     * 查询党员信息
     * @param queryOption
     * @param fields
     * @param option
     * @returns {Promise<any>}
     */
    async find(queryOption,fields,option){
        return new Promise((resolve, reject)=>{
            ArchiveModel.find(queryOption,fields,option,(err,data)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(data)
                }
            })
        })
    }

    /**
     * 后台分页查询
     * @param queryOption
     * @param page
     * @param pageSize
     * @returns {Promise<any>}
     */
    async queryPageList(queryOption,page,pageSize){
        if(Number.isNaN(page)){
            page = 1;
        }
        if(Number.isNaN(pageSize)){
            pageSize = 8;
        }
        if(!queryOption){
            queryOption = {};
        }
        return new Promise(function (resolve, reject){
            ArchiveModel.paginate(queryOption, { select:'-uTime', page:page, limit:pageSize,sort:{cTime:-1} }, function(err, result) {
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            });
        });
    }

    /**
     * 统计数据
     * @param queryOption
     * @returns {Promise<any>}
     */
    count(queryOption){
        return new Promise(function (resolve, reject){
            ArchiveModel.count(queryOption, function(err, result) {
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            });
        });
    }

    /**
     * 数据统计
     * @param aggregateOption
     * @returns {Promise<any>}
     */
    getArchiveAggregate(aggregateOption){
        return new Promise(function (resolve, reject){
            ArchiveModel.aggregate(aggregateOption,(err,data)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(data);
                }
            });
        });
    }

    //===============================================================================================
    /**
     * 获得客户端首页数量
     * @param type
     * @param good [1优秀党员、2优秀工作者]
     * @returns {Promise<any>}
     */
    getArchiveGoodCountClient(type,good){
        var queryOption = {status:1};
        if(type!=2){
            queryOption.type = type;
        }
        queryOption.good = good;
        return this.count(queryOption);
    }


    /**
     * 党员年龄统计
     * @returns {Promise<void>}
     */
    async getAgeCountClient(type){
        var resultData = [];
        try{
            var calus = config.pb_statistics.age.calu;
            var pYear = 0;
            for(let i=0;i<calus.length;i++){
                let item = calus[i];
                let sYear = 0;
                let eYear = 0;
                if(item>0){
                    if(pYear==0){
                        sYear = moment().subtract(item, "years").format("YYYY");
                        eYear = moment().format("YYYY");
                        pYear = sYear;
                    }else{
                        sYear = moment().subtract(item, "years").format("YYYY");
                        eYear  = pYear-1;
                        pYear = sYear;
                    }
                }else{
                    sYear = moment().subtract(200, "years").format("YYYY");
                    eYear = pYear-1;
                }
                //查询条件
                sYear +='-01-01'; eYear+='-12-31';
                var queryOption = {};
                if(type!=2){
                    queryOption.type = type;
                }
                queryOption.birthDate = {$gte: sYear, $lte: eYear};
                var count = await this.count(queryOption);
                await resultData.push(count);
            }
            return resultData;
        }catch(e){
            return resultData;
        }
    }

    /**
     * 入党时间统计
     * @param type
     * @returns {Promise<Array>}
     */
    async getDlCountClient(type){
        var resultData = [];
        try{
            var calus = config.pb_statistics.dl.calu;
            var pYear = 0;
            for(let i=0;i<calus.length;i++){
                let item = calus[i];
                let sYear = 0;
                let eYear = 0;
                if(item>0){
                    if(pYear==0){
                        sYear = moment().subtract(item, "years").format("YYYY");
                        eYear = moment().format("YYYY");
                        pYear = sYear;
                    }else{
                        sYear = moment().subtract(item, "years").format("YYYY");
                        eYear  = pYear-1;
                        pYear = sYear;
                    }
                }else{
                    sYear = moment().subtract(200, "years").format("YYYY");
                    eYear = pYear-1;
                }
                //查询条件
                sYear +='-01-01'; eYear+='-12-31';
                var queryOption = {};
                if(type!=2){
                    queryOption.type = type;
                }
                queryOption.rdDate = {$gte: sYear, $lte: eYear};
                var count = await this.count(queryOption);
                await resultData.push(count);
            }
            return resultData;
        }catch(e){
            return resultData;
        }
    }

    //学历统计



}

module.exports = new ArchiveService();