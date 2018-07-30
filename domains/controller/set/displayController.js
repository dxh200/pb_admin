"use strict";
const settingService = require('../../../service/settingService');
const multiparty = require('multiparty');
const config = require('config-lite')(__dirname);

const ResultAjax = require('./../../../utils/ResultAjax');
/**
 * 设置数据显示控制器
 */
class SetDisplayController{

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
            data = await settingService.getItem(config.display.key);
            if(!data){
                data = config.display;
            }
        }catch(e){
            console.log(e.message);
        }
        console.log(data);
        res.render("admin/set/display/index",{data:data});
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
        var val = {};
        for(let i=1;i<=10;i++){
            let _key = 'd'+i;
            val[_key] = req.body[_key];
        }
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

module.exports = new SetDisplayController();