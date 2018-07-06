const BranchModel = require('./../modules/branchModel');

/**
 * 支部业务操作
 */
class BranchService{
    constructor(){
    }

    async add(req,res,next,callback){
        let branchModel = new BranchModel(req.body);
        branchModel.save((err)=>{
            if(callback){
                callback(err);
            }
        })
    }

    async update(req,res,next,callback){
        let id_ = BranchModel.ObjectId(req.query.id)
        await BranchModel.update({"_id":id_},{$set:{"PHOTO_":"PHOTO_"}},(err)=>{
            if(err){
               console.log("err");
                callback(err,null);
            }else{
                console.log("success")
                callback(null);
            }
        });
    }

    async del(req,res,next){

    }

    async findById(req,res,next,callback){
        let id_ = BranchModel.ObjectId(req.query.id);
        await BranchModel.findOne(id_,(err,data)=>{
            if(err){
                console.log(err.message);
                callback(err,null);
            }else{
                if(data){
                    /*console.log(data.CTIME_.toLocaleString())
                    console.log(moment(data.CTIME_, "YYYY-MM-DD HH:mm"));
                    console.log(moment(data.CTIME_).format('YYYY-MM-DD HH:mm:ss'));
                    console.log(data);*/
                }
                callback(null,data)
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