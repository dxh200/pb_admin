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
    setItem(options,callback){
        if('id' in options){
            if(options.id){
                this._updateItem(options,callback);
            }else{
                this._addItem(options,callback);
            }
        }else{
            this._addItem(options,callback);
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
        let _id = SettingModel.ObjectId(options.id);
        await SettingModel.update({"_id":_id},{$set:options},(err,raw)=>{
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
     * @param callback
     * @returns {Promise<void>}
     */
    async getItem(key,callback){
        await SettingModel.findOne({key:key},"-cTime -uTime",(err,data)=>{
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

module.exports = new SettingService();