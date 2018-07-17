"use strict";
const settingService = require('../../../service/settingService');
const multiparty = require('multiparty');
const config = require('config-lite')(__dirname);

const ResultAjax = require('./../../../utils/ResultAjax');
/**
 * 系统设置控制器
 */
class SetBranchController{

    constructor(){
        this.edit = this.edit.bind(this);
    }

    /**
     * 进入设置页面
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    async index(req,res,next){
        var data = null;
        try{
            data = await settingService.getItem(config.branch.key);
            if(!data){
                data = config.branch;
            }
        }catch(e){
            console.log(e.message);
        }
        res.render("admin/set/branch/index",{branch:data});
    }

    /**
     * 编辑数据
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    async edit(req,res,next){
        var modelData = req.body;
        var val = {
            data1:modelData.data1,
            data2:modelData.data2,
            data3:modelData.data3,
            data4:modelData.data4
        };
        modelData.val = val;
        try{
            settingService.setItem(modelData,(err,data)=>{
                if(err){
                    res.json(ResultAjax.ERROR(err.message,{}));
                }else{
                    res.json(ResultAjax.SUCCESS("数据编辑成功",data));
                }
            });
        }catch(err){
            res.json(ResultAjax.ERROR(err.message,{}));
        }
    }


}

module.exports = new SetBranchController();