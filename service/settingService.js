const SettingModel = require('./../modules/settingModel');

/**
 * 设置数据业务操作
 */
class SettingService{
    constructor(){
        this.setItem = this.setItem.bind(this);
    }

    /**
     * 设置数据
     * @param options
     * @param callback
     */
    async setItem(options,callback){
        try{
            var countObj = 0;
            if(options.branchId){
                countObj = await this.countItem({'key':options.key,branchId:options.branchId});
            }else{
                countObj = await this.countItem({'key':options.key});
            }

            if(parseInt(countObj)>0){
                await this._updateItem(options,callback);
            }else{
                await this._addItem(options,callback);
            }
        }catch(e){
            callback(e,null);
        }
    }

    /**
     * 添加
     * @param option   模型数据
     * @param callback 回调err,data
     * @returns {Promise<void>}
     */
    async _addItem(options,callback){
        let settingModel = new SettingModel(options);
        await settingModel.save((err,data)=>{
            if(callback){
                callback(err,null);
            }else{
                callback(null,data);
            }
        })
    }

    /**
     * 编辑数据
     * @param key
     * @param options  数据模型
     * @param callback err
     * @returns {Promise<void>}
     */
    async _updateItem(options,callback){
        var queryOption = {};
        if(options.branchId){
            queryOption.key = options.key;
            queryOption.branchId = options.branchId;
        }else{
            queryOption.key = options.key;
        }
        await SettingModel.update(queryOption,{$set:options},(err,raw)=>{
            if(err){
                callback(err);
            }else{
                callback(null);
            }
        });
    }


    /**
     * 根据setKey查询数据
     * @param setKey
     * @returns {Promise<void>}
     */
    async getItem(key){
        return new Promise((resolve,reject)=>{
            SettingModel.findOne({key:key},"-cTime -uTime",(err,data)=>{
                console.log(data);
                console.log(key);
                if(err){
                    reject(err);
                }else{
                    resolve(data);
                }
            });
        });
    }

    /**
     * 根据key，branchId查询
     * @param key
     * @param branchId
     * @returns {Promise<any>}
     */
    async getItemBranchId(key,branchId){
        return new Promise((resolve,reject)=>{
            SettingModel.findOne({key:key,branchId:branchId},"-cTime -uTime",(err,data)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(data);
                }
            });
        });
    }

    /**
     * 查询数据量
     * @param query
     * @returns {Promise<any>}
     */
    async countItem(query){
        return await new Promise((resolve,reject)=>{
            SettingModel.count(query,(err,count)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(count);
                }
            });
        });
    }

}

module.exports = new SettingService();