"use strict";
const settingService = require('../../../service/settingService');
const config = require('config-lite')(__dirname);
const ResultAjax = require('./../../../utils/ResultAjax');
const NumberUtil = require('./../../../utils/NumberUtil');
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
        var branchId = req.query.branchId;
        var d1 = '',d2 = '',d3 = '',d4 = '',d5 = '';
        try{
            //党员
            var data1 = await settingService.getItem(config.pb_statistics.bType.key,branchId);
            if(!data1){
                data1 = config.pb_statistics.bType;
            }
            data1.val.some((item)=>{
                d1+=item.value+",";
            });
            d1 = d1.substring(0,d1.length-1);

            //性别
            var data2 = await settingService.getItem(config.pb_statistics.gender.key,branchId);
            if(!data2){
                data2 = config.pb_statistics.gender;
            }
            data2.val.some((item)=>{
                d2+=item.value+",";
            });
            d2 = d2.substring(0,d2.length-1);

            //党龄
            var data3 = await settingService.getItem(config.pb_statistics.dl.key,branchId);
            if(!data3){
                data3 = config.pb_statistics.dl;
            }
            data3.val.data.some((item)=>{
                d3+=item+",";
            });
            d3 = d3.substring(0,d3.length-1);

            //学历
            var data4 = await settingService.getItem(config.pb_statistics.education.key,branchId);
            if(!data4){
                data4 = config.pb_statistics.education;
            }
            data4.val.some((item)=>{
                d4+=item.value+",";
            });
            d4 = d4.substring(0,d4.length-1);

            //学历
            var data5 = await settingService.getItem(config.pb_statistics.age.key,branchId);
            if(!data5){
                data5 = config.pb_statistics.age;
            }
            data5.val.data.some((item)=>{
                d5+=item+",";
            });
            d5 = d5.substring(0,d5.length-1);
        }catch(e){
            console.log(e.message);
        }
        res.render("admin/set/archive/index",{data:{d1:d1,d2:d2,d3:d3,d4:d4,d5:d5},branchId:branchId});
    }

    /**
     * 编辑数据
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    async edit(req,res,next){
        var branchId = req.body.branchId;
        var data1,data2,data3,data4,data5 = '';
        data1 = req.body.data1;
        data2 = req.body.data2;
        data3 = req.body.data3;
        data4 = req.body.data4;
        data5 = req.body.data5;
        try{
            //党员发展
            var d1 = {};
            var strD1 = JSON.stringify(config.pb_statistics.bType);
            if(data1.split(",").length>=5){
                let t1 = data1.split(",");
                d1 = JSON.parse(strD1);
                d1.val[0].value = NumberUtil.convertNumber(t1[0]);
                d1.val[1].value = NumberUtil.convertNumber(t1[1]);
                d1.val[2].value = NumberUtil.convertNumber(t1[2]);
                d1.val[3].value = NumberUtil.convertNumber(t1[3]);
                d1.val[4].value = NumberUtil.convertNumber(t1[4]);
            }else{
                d1 = config.pb_statistics.bType;
            }

            //保存数据
            d1.branchId = branchId;
            settingService.setItem(d1,(err,data)=>{
                if(err){
                    throw new Error(err);
                }
            });

            //性别
            var d2 = [];
            var strD2 = JSON.stringify(config.pb_statistics.gender);
            if(data2.split(",").length>=2){
                let t2 = data2.split(",");
                d2 = JSON.parse(strD2);
                d2.val[0].value = NumberUtil.convertNumber(t2[0]);
                d2.val[1].value = NumberUtil.convertNumber(t2[1]);
            }else{
                d2 = config.pb_statistics.gender;
            }
            //保存数据
            d2.branchId = branchId;
            settingService.setItem(d2,(err,data)=>{
                if(err){
                    throw new Error(err);
                }
            });

            //党龄
            var d3 = {};
            var strD3 = JSON.stringify(config.pb_statistics.dl);
            if(data3.split(",").length>=6){
                let array = [];
                let t3 = data3.split(",");
                d3 = JSON.parse(strD3);
                array.push(NumberUtil.convertNumber(t3[0]));
                array.push(NumberUtil.convertNumber(t3[1]));
                array.push(NumberUtil.convertNumber(t3[2]));
                array.push(NumberUtil.convertNumber(t3[3]));
                array.push(NumberUtil.convertNumber(t3[4]));
                array.push(NumberUtil.convertNumber(t3[5]));
                d3.val.data = array;
            }else{
                d3 = config.pb_statistics.dl;
            }
            //保存数据
            d3.branchId = branchId;
            settingService.setItem(d3,(err,data)=>{
                if(err){
                    throw new Error(err);
                }
            });

            //学历
            var d4 = [];
            var strD4 = JSON.stringify(config.pb_statistics.education);
            if(data4.split(",").length>=7){
                let t4 = data4.split(",");
                d4 = JSON.parse(strD4);
                d4.val[0].value = NumberUtil.convertNumber(t4[0]);
                d4.val[1].value = NumberUtil.convertNumber(t4[1]);
                d4.val[2].value = NumberUtil.convertNumber(t4[2]);
                d4.val[3].value = NumberUtil.convertNumber(t4[3]);
                d4.val[4].value = NumberUtil.convertNumber(t4[4]);
                d4.val[5].value = NumberUtil.convertNumber(t4[5]);
                d4.val[6].value = NumberUtil.convertNumber(t4[6]);
            }else{
                d4 = config.pb_statistics.education;
            }
            //保存数据
            d4.branchId = branchId;
            settingService.setItem(d4,(err,data)=>{
                if(err){
                    throw new Error(err);
                }
            });

            //年龄
            var d5 = {};
            var strD5 = JSON.stringify(config.pb_statistics.age);
            if(data5.split(",").length>=5){
                let array = [];
                let t5 = data5.split(",");
                d5 = JSON.parse(strD5);
                array.push(NumberUtil.convertNumber(t5[0]));
                array.push(NumberUtil.convertNumber(t5[1]));
                array.push(NumberUtil.convertNumber(t5[2]));
                array.push(NumberUtil.convertNumber(t5[3]));
                array.push(NumberUtil.convertNumber(t5[4]));
                d5.val.data = array;
            }else{
                d5 = config.pb_statistics.age;
            }
            //保存数据
            d5.branchId = branchId;
            settingService.setItem(d5,(err,data)=>{
                if(err){
                    throw new Error(err);
                }
            });
            res.json(ResultAjax.SUCCESS("数据编辑成功",{}));
        }catch(err){
            res.json(ResultAjax.ERROR(err.message,{}));
        }
    }


}

module.exports = new SetBranchController();