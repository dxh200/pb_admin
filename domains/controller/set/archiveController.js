"use strict";
const settingService = require('../../../service/settingService');
const multiparty = require('multiparty');
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
        var data1,data2,data3,data4,data5 = '';
        try{
            //党员
            data1 = await settingService.getItem(config.branch.key);
            if(!data1){
                data1 = config.branch;
            }
        }catch(e){
            console.log(e.message);
        }
        res.render("admin/set/archive/index",{data:{}});
    }

    /**
     * 编辑数据
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    async edit(req,res,next){
        var data1,data2,data3,data4,data5 = '';
        data1 = req.body.data1;
        data2 = req.body.data2;
        data3 = req.body.data3;
        data4 = req.body.data4;
        data5 = req.body.data5;
        try{
            console.log(data1);
            //党员发展
            var d1 = [];
            var strD1 = JSON.stringify(config.pb_statistics.bType.val);
            if(data1.split(",").length>=5){
                let t1 = data1.split(",");
                d1 = JSON.parse(strD1);
                d1[0].value = NumberUtil.convertNumber(t1[0]);
                d1[1].value = NumberUtil.convertNumber(t1[1]);
                d1[2].value = NumberUtil.convertNumber(t1[2]);
                d1[3].value = NumberUtil.convertNumber(t1[3]);
                d1[4].value = NumberUtil.convertNumber(t1[4]);
            }else{
                d1 = config.pb_statistics.bType.val;
            }

            //性别
            var d2 = [];
            var strD2 = JSON.stringify(config.pb_statistics.gender.val);
            if(data2.split(",").length>=2){
                let t2 = data2.split(",");
                d2 = JSON.parse(strD2);
                d2[0].value = NumberUtil.convertNumber(t2[0]);
                d2[1].value = NumberUtil.convertNumber(t2[1]);
            }else{
                d2 = config.pb_statistics.gender.val;
            }

            //党龄
            var d3 = {};
            var strD3 = JSON.stringify(config.pb_statistics.dl.val);
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
                d3.data = array;
            }else{
                d3 = config.pb_statistics.dl.val;
            }

            //学历
            var d4 = [];
            var strD4 = JSON.stringify(config.pb_statistics.education.val);
            if(data4.split(",").length>=7){
                let t4 = data4.split(",");
                d4 = JSON.parse(strD4);
                d4[0].value = NumberUtil.convertNumber(t4[0]);
                d4[1].value = NumberUtil.convertNumber(t4[1]);
                d4[2].value = NumberUtil.convertNumber(t4[2]);
                d4[3].value = NumberUtil.convertNumber(t4[3]);
                d4[4].value = NumberUtil.convertNumber(t4[4]);
                d4[5].value = NumberUtil.convertNumber(t4[5]);
                d4[6].value = NumberUtil.convertNumber(t4[6]);
            }else{
                d4 = config.pb_statistics.education.val;
            }

            //年龄
            var d5 = {};
            var strD5 = JSON.stringify(config.pb_statistics.age.val);
            if(data5.split(",").length>=5){
                let array = [];
                let t5 = data5.split(",");
                d5 = JSON.parse(strD5);
                array.push(NumberUtil.convertNumber(t5[0]));
                array.push(NumberUtil.convertNumber(t5[1]));
                array.push(NumberUtil.convertNumber(t5[2]));
                array.push(NumberUtil.convertNumber(t5[3]));
                array.push(NumberUtil.convertNumber(t5[4]));
                d5.data = array;
            }else{
                d5 = config.pb_statistics.age.val;
            }

            console.log(d5);


            res.json(ResultAjax.SUCCESS("数据编辑成功",{}));
        }catch(err){
            res.json(ResultAjax.ERROR(err.message,{}));
        }
    }


}

module.exports = new SetBranchController();