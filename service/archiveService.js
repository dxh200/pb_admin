const ArchiveModel = require('./../modules/archiveModel');

/**
 * 党员信息业务管理
 */
class ArchiveService{
    constructor(){
        this.getArchiveGoodCountClient = this.getArchiveGoodCountClient.bind(this);
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
}

module.exports = new ArchiveService();