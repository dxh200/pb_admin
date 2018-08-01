"use strict";
const settingService = require('../../../service/settingService');
const multiparty = require('multiparty');
const config = require('config-lite')(__dirname);

const ResultAjax = require('./../../../utils/ResultAjax');
/**
 * 运营数据控制器
 */
class SetOperationController{

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
        var mData = null,sData = null;
        try{
            //手动
            mData = await settingService.getItem(config.operation.m.key);
            //同步
            sData = await settingService.getItem(config.operation.s.key);
            if(!mData){
                mData = config.operation.m;
            }else{
                mData.val.label = JSON.stringify(mData.val.label);
                mData.val.text = JSON.stringify(mData.val.text);
                mData.val.data = JSON.stringify(mData.val.data);
            }
            if(!sData){
                sData = config.operation.s;
            }


        }catch(e){
            console.log(e.message);
        }
        res.render("admin/set/operation/index",{mData:mData,sData:sData});
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
            label:JSON.parse(modelData.label),
            text:JSON.parse(modelData.text),
            data:JSON.parse(modelData.data)
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

module.exports = new SetOperationController();