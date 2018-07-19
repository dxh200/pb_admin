const UserModel = require('../modules/userModel');

/**
 * 系统用户业务管理
 */
class UserService{
    constructor(){
    }

    /**
     * 添加
     * @param option   模型数据
     * @param callback 回调err,data
     * @returns {Promise<void>}
     */
    async addUser(option,callback){
        let userModel = new UserModel(option);
        await userModel.save((err,data)=>{
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
    async updateUser(id,options,callback){
        let _id = UserModel.ObjectId(id);
        await UserModel.update({"_id":_id},{$set:options},(err,raw)=>{
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
    async delUser(id,callback){
        let _id = UserModel.ObjectId(id);
        await UserModel.deleteOne({"_id":_id},(err)=>{
            if(err){
                callback(err);
            }else{
                callback(null);
            }
        })
    }

    /**
     * 查询指定用户
     * @param queryoption  查询条件
     * @param fields       "field,field"多个逗号分隔
     * @param callbck
     * @returns {Promise<void>}
     */
    async findUser(queryoption,fields,callback){
        await UserModel.findOne(queryoption,fields,(err,data)=>{
            if(err){
                callback(err,null);
            }else{
                if(data){
                    callback(null,data)
                }else{
                    callback(null,null);
                }
            }
        });
    }

    /**
     * 根据id查询支部数据
     * @param id
     * @param callback
     * @returns {Promise<void>}
     */
    async findById(id,callback){
        let _id = UserModel.ObjectId(id);
        await UserModel.findOne(_id,(err,data)=>{
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
            UserModel.paginate(queryOption, { select:'-uTime', page:page, limit:pageSize,sort:{cTime:-1} }, function(err, result) {
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            });
        });

    }
}

module.exports = new UserService();