const ArchiveModel = require('./../modules/archiveModel');
const ArchiveDevelopModel = require('./../modules/archiveDevelopModel');
const config = require('config-lite')(__dirname);
const moment = require('moment');

/**
 * 党员信息业务管理
 */
class ArchiveService{
    constructor(){
        this.getArchiveGoodCountClient = this.getArchiveGoodCountClient.bind(this);
        this.getAgeCountClient = this.getAgeCountClient.bind(this);

        this.editDevelop = this.editDevelop.bind(this);
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
     * 根据id查询
     * @param id
     * @param fields 指定字段
     * @returns {Promise<any>}
     */
    async findFieldsById(id,fields){
        let _id = ArchiveModel.ObjectId(id);
        return new Promise((resolve, reject) => {
            ArchiveModel.findOne(_id,fields,(err,data)=>{
                if(err){
                    reject(err);
                }else{
                    if(data){
                        resolve(data)
                    }else{
                        resolve(null)
                    }
                }
            })
        });

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
    //党员发展阶段操作
    async editDevelop(id,options,field){
        if(id){
            let _id = ArchiveDevelopModel.ObjectId(id);
            var paramsObj = await this.findDevelopByArchiveId(options.archiveId,"params");
            let _params_  = paramsObj.params;
            _params_.currentStage = options.params.currentStage;
            _params_.state = options.params.state;

            if(_params_.data[field]){
                if(_params_.data[field].status=="0" && options.params.data[field].status=="1"){
                    _params_.data[field] = options.params.data[field];
                }
                if(_params_.data[field].status=="1" && options.params.data[field].status=="0"){
                    _params_.data[field] = options.params.data[field];
                }
            }else{
                _params_.data[field] = options.params.data[field];
            }
            options.params = _params_;
            ArchiveDevelopModel.update({_id:_id},{$set:options},(err,data)=>{
                if(err){
                    console.log(err);
                }else{
                    console.log(data);
                }
            });
        }else{
            new ArchiveDevelopModel(options).save();
        }
    }

    async findDevelopByArchiveId(id,fields){
        return new Promise(function (resolve, reject){
            ArchiveDevelopModel.findOne({archiveId:id},fields,(err,data)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(data)
                }
            })
        });
    }

    countDevelop(queryOption){
        return new Promise(function (resolve, reject){
            ArchiveDevelopModel.count(queryOption, function(err, result) {
                if(err){
                    reject(err);
                }else{
                    resolve(result);
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
    async getAgeCountClient(type,branchId){
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
                if(branchId){
                    queryOption.branchId = branchId;
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
    async getDlCountClient(type,branchId){
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
                if(branchId){
                    queryOption.branchId = branchId;
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