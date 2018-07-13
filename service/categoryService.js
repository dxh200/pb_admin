const CategoryModel = require('./../modules/categoryModel');

/**
 * 支部业务操作
 */
class CategoryService{
    constructor(){
    }

    /**
     * 添加
     * @param option   模型数据
     * @param callback 回调err,data
     * @returns {Promise<void>}
     */
    async add(option,callback){
        let categoryModel = new CategoryModel(option);
        await categoryModel.save((err,data)=>{
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
        let _id = CategoryModel.ObjectId(id);
        await CategoryModel.update({"_id":_id},{$set:options},(err,raw)=>{
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
        let _id = CategoryModel.ObjectId(id);
        await CategoryModel.deleteOne({"_id":_id},(err)=>{
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
        let _id = CategoryModel.ObjectId(id);
        await CategoryModel.findOne(_id,(err,data)=>{
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
     * 根据id查询分类名称
     * @param id
     * @param callback
     * @returns {Promise<void>}
     */
    async getCategoryNameById(id,callback){
        let _id = CategoryModel.ObjectId(id);
        await CategoryModel.findOne(_id,"name",(err,data)=>{
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
     * 查询全部支部信息
     * @param queryOption  查询条件
     * @param friends      查询字段多个空格分隔
     * @param callback
     * @returns {Promise<void>}
     */
    async getAllList(queryOption,friends,callback){
        await CategoryModel.find(queryOption,friends,{sort:{cTime:-1}},(err,data)=>{
            callback(err,data);
        });
    }


}

module.exports = new CategoryService();