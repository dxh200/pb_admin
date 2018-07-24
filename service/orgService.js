const OrgModel = require('./../modules/orgModel');

/**
 * 基层组织业务
 */
class OrgService{
    constructor(){
        this.getOrgCountClient = this.getOrgCountClient.bind(this);
    }

    /**
     * 添加
     * @param option   模型数据
     * @param callback 回调err,data
     * @returns {Promise<void>}
     */
    async addOrg(option,callback){
        let orgModel = new OrgModel(option);
        await orgModel.save((err,data)=>{
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
    async updateOrg(id,options,callback){
        let _id = OrgModel.ObjectId(id);
        await OrgModel.update({"_id":_id},{$set:options},(err,raw)=>{
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
    async delOrg(id,callback){
        let _id = OrgModel.ObjectId(id);
        await OrgModel.deleteOne({"_id":_id},(err)=>{
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
        let _id = OrgModel.ObjectId(id);
        await OrgModel.findOne(_id,(err,data)=>{
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
        await OrgModel.paginate(queryOption, {page:page, limit:pageSize,sort:{cTime:-1},populate:{path:'bId',select:'bName'}}, function(err, result) {
            callback(err,result);
        });
    }

    /**
     * 基层组织统计
     * @param queryOption
     * @returns {Promise<any>}
     */
    count(queryOption){
        return new Promise((resolve,reject)=>{
           /* OrgModel.aggregate([{$match:queryOption}]).count('orgCount').exec((err,data)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(data);
                }
            });*/
            OrgModel.count(queryOption,(err,data)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(data);
                }
            });
        });

    }

    //====================================================================================================
    /**
     * 客户端统计基层组织数量
     * @param type
     * @returns {Promise<any>}
     */
    getOrgCountClient(type){
        var queryOption = {status:1};
        if(type!=2){
            queryOption.type = type;
        }
        return this.count(queryOption);
    }
}

module.exports = new OrgService();