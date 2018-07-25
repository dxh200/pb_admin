const BranchModel = require('./../modules/branchModel');

/**
 * 支部业务操作
 */
class BranchService{
    constructor(){
        this.getBranchCountClient = this.getBranchCountClient.bind(this);
    }

    /**
     * 添加
     * @param option   模型数据
     * @param callback 回调err,data
     * @returns {Promise<void>}
     */
    async add(option,callback){
        let branchModel = new BranchModel(option);
        await branchModel.save((err,data)=>{
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
    async update(id,options,callback){
        let _id = BranchModel.ObjectId(id);
        await BranchModel.update({"_id":_id},{$set:options},(err,raw)=>{
            if(err){
                callback(err);
            }else{
                callback(null);
            }
        });
    }

    /**
     * 删除支部数据
     * @param id
     * @param callback
     * @returns {Promise<void>}
     */
    async del(id,callback){
        let _id = BranchModel.ObjectId(id);
        await BranchModel.deleteOne({"_id":_id},(err)=>{
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
        let _id = BranchModel.ObjectId(id);
        await BranchModel.findOne(_id,(err,data)=>{
            if(err){
                console.log(err.message);
                callback(err,null);
            }else{
                if(data){
                    callback(null,data)
                }

            }
        })
    }

    /**
     * 根据id查询支部信息
     * @param id
     * @param fields   'field field'
     * @param callback
     * @returns {Promise<void>}
     */
    async findFieldById(id,fields,callback){
        let _id = BranchModel.ObjectId(id);
        await BranchModel.findOne({_id:_id},fields,(err,data)=>{
            if(err){
                callback(err,null);
            }else{
                if(data){
                    callback(null,data)
                }else{
                    callback(null,null)
                }

            }
        })
    }

    /**
     * 查询全部支部信息
     * @param queryOption  查询条件
     * @param friends      查询字段多个空格分隔
     * @param callback
     * @returns {Promise<void>}
     */
    async getAllList(queryOption,friends,callback){
        queryOption.type = '1';
        queryOption.status = 1;
        await BranchModel.find(queryOption,friends,{sort:{cTime:-1}},(err,data)=>{
            callback(err,data);
        });
    }

    /**
     * 分页查询支部数据
     * @param queryOption
     * @param page
     * @param pageSize
     * @param callback
     * @returns {Promise<void>}
     */
    async queryPageList(queryOption,page,pageSize,callback){
        if(Number.isNaN(page)){
            page = 1;
        }
        if(Number.isNaN(pageSize)){
            pageSize = 8;
        }
        if(!queryOption){
            queryOption = {};
        }
        await BranchModel.paginate(queryOption, { select:'-location -summary -uTime -businessId -director -vice', page:page, limit:pageSize,sort:{cTime:-1} }, function(err, result) {
            callback(err,result);
        });

        /*await BranchModel.find({'CTIME_':{$gt:"2018-07-06 12:02"}},(err,data)=>{
            if(data.length>0){
                console.log(moment(data[0].CTIME_, "YYYY-MM-DD HH:mm"));
                console.log(data);
            }
        })*/
    }

    /**
     * 支部数据统计
     * @param queryOption
     * @returns {Promise<any>}
     */
    count(queryOption) {
        return new Promise((resolve,reject)=>{
            /*BranchModel.aggregate([{ $match:queryOption}]).count('branchCount').exec((err,data)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(data);
                }

            });*/
            BranchModel.count(queryOption,(err,data)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(data);
                }
            })
        });
    }

    //客户端=========================================================================================
    /**
     * 获得客户端首页支部名称、坐标
     * @param type
     * @param size
     * @returns {Promise<any>}
     */
    getBranchNameListClient(type) {
        var queryOption = {status:1};
        if(type!=2){
            queryOption.type = type;
        }
        return new Promise((resolve,reject)=>{
            BranchModel.find(queryOption, "bName location",(err, data) => {
                if(err){
                    reject(err);
                }else{
                    resolve(data);
                }
            });
        });
    }

    /**
     * 根据支部数据类型获得支部总数据量
     * @param type
     * @returns {Promise<any>}
     */
    getBranchCountClient(type) {
        var queryOption = {status:1};
        if(type!=2){
            queryOption.type = type;
        }
        return this.count(queryOption);
    }
}

module.exports = new BranchService();