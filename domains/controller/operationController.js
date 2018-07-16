"use strict";
const settingService = require('../../service/settingService');
const multiparty = require('multiparty');
const config = require('config-lite')(__dirname);

const ResultAjax = require('./../../utils/ResultAjax');
/**
 * 运营数据控制器
 */
class OperationController{

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
        var mData = config.operation.m;
        var sData = config.operation.s;
        //手动
        await settingService.getItem(config.operation.m.key,(err,data)=>{
            if(!err){
                if(data){
                    mData = data;
                }
            }
        });
        //同步
        await settingService.getItem(config.operation.s.key,(err,data)=>{
            if(!err){
                if(data){
                    sData = data;
                }
            }
        });
        res.render("admin/operation/index",{mData:mData,sData:sData});
    }

    /**
     * 编辑数据
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    async edit(req,res,next){
        let key = req.body.key;
        if(key==config.operation.m.key){
            await this._mEdit(req,res,next);
        }else{
            await this._sEdit(req,res,next);
        }
    }

    /**
     * 手动运营数据
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    _mEdit(req,res,next){
        var modelData = req.body;
        var val = {
            label:modelData.label,
            text:modelData.text,
            data:modelData.data
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

    /**
     * 同步运营数据
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    _sEdit(req,res,next){

        res.json(ResultAjax.ERROR(err.message,{}));
    }

}

module.exports = new OperationController();