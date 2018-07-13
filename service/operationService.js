const OperationModel = require('./../modules/operationModel');

/**
 * 运营业务操作
 */
class OperationService{
    constructor(){
    }

    /**
     * 添加
     * @param option   模型数据
     * @param callback 回调err,data
     * @returns {Promise<void>}
     */
    async addOpertation(option,callback){
        let operationModel = new OperationModel(option);
        await operationModel.save((err,data)=>{
            if(callback){
                callback(err,null);
            }else{
                callback(null,data);
            }
        })
    }

    /**
     * 编辑数据
     * @param type     【0同步、1手动】
     * @param options  数据模型
     * @param callback err
     * @returns {Promise<void>}
     */
    async updateOpertation(type,options,callback){
        await OperationModel.update({"type":type},{$set:options},(err,raw)=>{
            if(err){
                callback(err);
            }else{
                callback(null);
            }
        });
    }


    /**
     * 根据Type查询数据【0同步、1手动】
     * @param id
     * @param callback
     * @returns {Promise<void>}
     */
    async findByType(type,callback){
        await OperationModel.findOne({type:type},"-cTime -uTime",(err,data)=>{
            if(err){
                callback(err,null);
            }else{
                if(data){
                    callback(null,data)
                }

            }
        })
    }

}

module.exports = new OperationService();