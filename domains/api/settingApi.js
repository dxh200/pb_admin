"use strict";
const BaseApi = require('./baseApi');
const ResultAjax = require('./../../utils/ResultAjax');
const settingService = require('../../service/settingService');

const config = require('config-lite')(__dirname);

class SettingApi extends BaseApi{

    /**
     * @api {post} /api/setting/setOperation 运营数据
     * @apiDescription 根据城略统计["考试","阅读","会议","投票","调查","活动"]6项数据的发起率、参与率如下data参数
     * @apiName setOperation
     * @apiGroup 设置数据
     *
     * @apiParam {string} data  统计数据,格式：[[0,0,0,0,0,0],[0,0,0,0,0,0]]，第一组数据为发起率、第二组数据为参与率，每组数据必须为6项 (必填)
     *
     * @apiSuccess {json} result
     * @apiSuccessExample {json} 成功返回:
     * {
     *      "code":"0",
     *      "msg":"",
     *      "data":{}
     * }
     *
     * @apiError {json} result
     * @apiErrorExample  {json} 成功返回:
     * {
     *      "code":"1|-1",
     *      "msg":"错误信息",
     *      "data":{}
     * }
     * @apiSampleRequest /api/setting/setOperation
     * @apiVersion 0.0.1
     *
     */
    async setOperation(req,res){
        try{
            var bodyParams = req.body;

            if(!bodyParams['data']){
                res.json(ResultAjax.FAILED("运营统计数据不能为空",{}));
                return false;
            }

            //JSON数据格式验证
            var dataObj = null;
            try {
                dataObj = JSON.parse(bodyParams['data']);
            }catch(e){
                res.json(ResultAjax.FAILED("数据JSON格式错误:"+e.message,{}));
                return false;
            }
            if(dataObj){
                if(dataObj.length==2){
                    if(dataObj[0].length<6 || dataObj[1].length<6 || dataObj[0].length>6 || dataObj[1].length>6){
                        res.json(ResultAjax.FAILED("数据JSON格式错误，每项数据个数错误",{}));
                        return false;
                    }
                }else{
                    res.json(ResultAjax.FAILED("数据JSON格式错误，数量长度错误",{}));
                    return false;
                }
            }

            //保存数据操作
            var modelData = config.operation.s;

            console.log(modelData);
            modelData.val.label = JSON.parse(modelData.val.label);
            modelData.val.text = JSON.parse(modelData.val.text);
            modelData.val.data = dataObj;
            modelData.type = '0';
            console.log(modelData);
            settingService.setItem(modelData,(err,data)=>{
                if(err){
                    res.json(ResultAjax.ERROR(err.message,{}));
                }else{
                    res.json(ResultAjax.SUCCESS("保存成功",data));
                }
            });
        }catch(e){
            res.json(ResultAjax.ERROR(e.message,{}));
        }



    }
}

module.exports = new SettingApi();