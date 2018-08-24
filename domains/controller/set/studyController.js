"use strict";
const settingService = require('../../../service/settingService');
const config = require('config-lite')(__dirname);

const ResultAjax = require('./../../../utils/ResultAjax');
const NumberUtil = require('./../../../utils/NumberUtil');
/**
 * 学习宣传设置控制器
 */
class SetStudyController{

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
        var timeInterval = null;
        try{
            timeInterval = await settingService.getItem(config.timeInterval.key);
            if(!timeInterval){
                timeInterval = config.timeInterval;
            }
            var vals = "";
            timeInterval.val.some((item)=>{
                vals+=item+",";
            });
            vals = vals.substring(0,vals.length-1);
            timeInterval.val = vals;
        }catch(e){
            console.log(e.message);
        }
        res.render("admin/set/study/index",{timeInterval:timeInterval});
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
        try{
            var data = {};
            var dataConfig = JSON.stringify(config.timeInterval);
            var valStr = modelData.val;
            if(valStr.split(",").length>=6){
                let array = [];
                let valStrs = valStr.split(",");
                data = JSON.parse(dataConfig);
                array.push(NumberUtil.convertNumber(valStrs[0])==0?1:parseInt(NumberUtil.convertNumber(valStrs[0])));
                array.push(NumberUtil.convertNumber(valStrs[1])==0?1:parseInt(NumberUtil.convertNumber(valStrs[1])));
                array.push(NumberUtil.convertNumber(valStrs[2])==0?1:parseInt(NumberUtil.convertNumber(valStrs[2])));
                array.push(NumberUtil.convertNumber(valStrs[3])==0?1:parseInt(NumberUtil.convertNumber(valStrs[3])));
                array.push(NumberUtil.convertNumber(valStrs[4])==0?1:parseInt(NumberUtil.convertNumber(valStrs[4])));
                array.push(NumberUtil.convertNumber(valStrs[5])==0?1:parseInt(NumberUtil.convertNumber(valStrs[5])));
                data.val = array;
            }else{
                data = config.timeInterval;
            }

            settingService.setItem(data,(err,data)=>{
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

module.exports = new SetStudyController();