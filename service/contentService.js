const ContentModel = require('./../modules/contentModel');

/**
 * 内容管理包括【1学习宣传、2党务工作、3关注热文】
 */
class ContentService{
    constructor(){
        this.countModuleClient = this.countModuleClient.bind(this);
    }

    /**
     * 添加
     * @param option   模型数据
     * @param callback 回调err,data
     * @returns {Promise<void>}
     */
    async addContent(option,callback){
        let contentModel = new ContentModel(option);
        await contentModel.save((err,data)=>{
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
    async updateContent(id,options,callback){
        let _id = ContentModel.ObjectId(id);
        await ContentModel.update({"_id":_id},{$set:options},(err,raw)=>{
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
    async delContent(id,callback){
        let _id = ContentModel.ObjectId(id);
        await ContentModel.deleteOne({"_id":_id},(err)=>{
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
        let _id = ContentModel.ObjectId(id);
        await ContentModel.findOne(_id,(err,data)=>{
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
     * 根据id查询指定字段
     * @param id
     * @param field
     * @returns {Promise<any>}
     */
    async findFieldById(id,field){
        let _id = ContentModel.ObjectId(id);
        return new Promise(function (resolve, reject){
            ContentModel.findOne(_id,field,(err,data)=>{
                if(err){
                    reject(err);
                }else{
                    if(data){
                        resolve(data)
                    }

                }
            })
        });
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
            ContentModel.paginate(queryOption, { select:'-uTime -module -content', page:page, limit:pageSize,sort:{cTime:-1} }, function(err, result) {
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            });
        });
    }

    async count(queryOption){
        return new Promise(function (resolve, reject){
            ContentModel.count(queryOption, function(err, result) {
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            });
        });
    }



    //客户端===========================================================================================================
    /**
     * 获得客户端首页关注热文图片
     * @param type
     * @param size
     * @returns {Promise<any>}
     */
    getNewsImgClient(type,size) {
        var queryOption = {status:1};
        if(type!=2){
            queryOption.type = type;
        }
        queryOption.photo = { $ne:''};
        queryOption.module = '3';
        return new Promise((resolve,reject)=>{
            ContentModel.find(queryOption, "title photo", {sort: {num: -1},limit:size}, (err, data) => {
                if(err){
                    reject(err);
                }else{
                    resolve(data);
                }
            });
        });
    }

    /**
     * 客户端信息分页查询
     * @param queryOption
     * @param page
     * @param pageSize
     * @returns {Promise<any>}
     */
    async queryPageListClient(queryOption,page,pageSize){
        if(Number.isNaN(page)){
            page = 1;
        }
        if(Number.isNaN(pageSize)){
            pageSize = 5;
        }
        if(!queryOption){
            queryOption = {};
        }
        //如果type是2就是查询所有，删除查询条件type
        if(queryOption.type==2){
            delete queryOption.type;
        }
        queryOption.status = 1;
        return new Promise(function (resolve, reject){
            ContentModel.paginate(queryOption, { select:'title photo num customTime summary', page:page, limit:pageSize,sort:{cTime:-1} }, function(err, result) {
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            });
        });
    }

    /**
     * 根据moduel、category统计数量
     * @param module
     * @param category
     * @param type
     * @returns {Promise<*>}
     */
    async countModuleClient(module,category,type){
        var queryOption = {};
        if(module){
            queryOption.module = module;
        }
        if(category){
            queryOption.category = category;
        }
        if(type){
            queryOption.type = type;
        }
        queryOption.status = 1;
        return this.count(queryOption);
    }

    /**
     * 根据id查询上一条数据
     * @param id
     * @param module
     * @param category
     * @param type
     * @returns {Promise<any>}
     */
    async lastContentByIdClient(id,module,category,type){
        var queryOption = {};

        if(module){
            queryOption.module = module;
        }
        if(category){
            queryOption.category = category;
        }
        //上一条
        if(id){
            queryOption._id = { "$gt" :ContentModel.ObjectId(id)};
        }
        queryOption.type = type;
        queryOption.status = 1;
        return new Promise(function (resolve, reject){
            ContentModel.find(queryOption, "_id", {sort: {cTime: -1},limit:1},(err,data)=>{
                if(err){
                    reject(err);
                }else{
                    if(data.length==0){
                        resolve("");
                    }else{
                        resolve(data[0]._id);
                    };
                }
            })
        });
    }

    /**
     * 根据id查询下一条数据
     * @param id
     * @param module
     * @param category
     * @param type
     * @returns {Promise<any>}
     */
    async nextContentByIdClient(id,module,category,type){
        var queryOption = {};

        if(module){
            queryOption.module = module;
        }
        if(category){
            queryOption.category = category;
        }
        //上一条
        if(id){
            queryOption._id = { "$lt" :ContentModel.ObjectId(id)};
        }
        queryOption.type = type;
        queryOption.status = 1;
        return new Promise(function (resolve, reject){
            ContentModel.find(queryOption, "_id", {sort: {cTime: -1},limit:1},(err,data)=>{
                if(err){
                    reject(err);
                }else{
                    if(data.length==0){
                        resolve("");
                    }else{
                        resolve(data[0]._id);
                    };
                }
            })
        });
    }

    /**
     * 根据module、category获得id
     * @param module
     * @param category
     * @param type
     * @returns {Promise<any>}
     */
    async getContentByModuleClient(module,category,type){
        var queryOption = {};

        if(module){
            queryOption.module = module;
        }
        if(category){
            queryOption.category = category;
        }
        queryOption.type = type;
        queryOption.status = 1;
        return new Promise(function (resolve, reject){
            ContentModel.find(queryOption, "_id", {sort: {cTime: -1},limit:1},(err,data)=>{
                if(err){
                    reject(err);
                }else{
                    if(data.length==0){
                        resolve("");
                    }else{
                        resolve(data[0]._id);
                    };

                }
            })
        });
    }
}

module.exports = new ContentService();