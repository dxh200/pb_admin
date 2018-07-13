"use strict";
const operationService = require('./../../service/operationService');
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
        var mData = config.operation;
        var sData = config.operation;
        //手动
        await operationService.findByType('1',(err,data)=>{
            if(!err){
                if(data){
                    mData = data;
                }
            }
        });
        //同步
        await operationService.findByType('0',(err,data)=>{
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
        let t = req.body.type;
        if(t=='1'){
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
        try{
            let id = modelData.id;
            if(id){
                operationService.updateOpertation(modelData.type,modelData,(err,data)=>{
                    if(err){
                        res.json(ResultAjax.ERROR(err.message,{}));
                    }else{
                        res.json(ResultAjax.SUCCESS("数据编辑成功",data));
                    }
                });
            }else{
                operationService.addOpertation(modelData,(err,data)=>{
                    if(err){
                        res.json(ResultAjax.ERROR(err.message,{}));
                    }else{
                        res.json(ResultAjax.SUCCESS("数据编辑成功",data));
                    }
                });
            }
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