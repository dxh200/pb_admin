const BranchModel = require('./../modules/branchModel');

/**
 * 支部业务操作
 */
class BranchService{
    constructor(){
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
                    /*console.log(data.CTIME_.toLocaleString())
                    console.log(moment(data.CTIME_, "YYYY-MM-DD HH:mm"));
                    console.log(moment(data.CTIME_).format('YYYY-MM-DD HH:mm:ss'));
                    console.log(data);*/
                    callback(null,data)
                }

            }
        })
    }


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
}

module.exports = new BranchService();