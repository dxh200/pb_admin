const BranchModel = require('./../modules/branchModel');

/**
 * 支部业务操作
 */
class BranchService{
    constructor(){
    }

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

    async update(id,options,callback){
        let _id = BranchModel.ObjectId(id);
        await BranchModel.update({"_id":_id},{$set:options},(err,raw)=>{
            if(err){
                callback(err,null);
            }else{
                callback(null);
            }
        });
    }

    async del(id,callback){
        let id_ = BranchModel.ObjectId(id);
        await BranchModel.deleteOne({"_id":_id},(err)=>{
            if(err){
                callback(err);
            }else{
                callback(null);
            }
        })
    }

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

    async queryPageList(){
        await BranchModel.find({'CTIME_':{$gt:"2018-07-06 12:02"}},(err,data)=>{
            if(data.length>0){
                console.log(moment(data[0].CTIME_, "YYYY-MM-DD HH:mm"));
                console.log(data);
            }
        })
    }
}

module.exports = new BranchService();