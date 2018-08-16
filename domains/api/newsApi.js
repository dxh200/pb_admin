"use strict";
const BaseApi = require('./baseApi');
const ResultAjax = require('./../../utils/ResultAjax');
const contentService = require('../../service/contentService');
const moment = require('moment');

class NewsApi extends BaseApi{


    /**
     * @api {post} /api/news/addContent 添加内容
     * @apiDescription 同步城略图所有图文有封面信息阅读量靠前的10条信息
     * @apiName addContent
     * @apiGroup 关注热文
     *
     * @apiParam {string} title 标题 (必填)
     * @apiParam {string} photo 封面图片,图片路径 (必填)
     * @apiParam {string} source 内容来源 (必填)
     * @apiParam {string} author 作者
     * @apiParam {string} content 内容
     * @apiParam {string} summary 内容简介，120字以内
     * @apiParam {string} num 阅读量 (必填)
     * @apiParam {string} customTime 自定义发布时间,格式YYYY-MM-DD(1970-01-01)
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
     * @apiSampleRequest /api/news/addContent
     * @apiVersion 0.0.1
     */
    async addContent(req,res){
        try{
            var bodyParams  = req.body;

            //为空判断
            if(!bodyParams['title']){
                res.json(ResultAjax.FAILED("标题不能为空",{}));
                return false;
            }
            if(!bodyParams['photo']){
                res.json(ResultAjax.FAILED("封面不能为空",{}));
                return false;
            }
            if(!bodyParams['source']){
                res.json(ResultAjax.FAILED("来源不能为空",{}));
                return false;
            }
            if(!bodyParams['num']){
                res.json(ResultAjax.FAILED("阅读量不能为空",{}));
                return false;
            }
            if(bodyParams['num']){
                if(!(/^\d+$/.test(bodyParams['num']))){
                    res.json(ResultAjax.FAILED("阅读量必须为数字",{}));
                    return false;
                }
                bodyParams['num'] = parseInt(bodyParams['num']);
            }else{
                bodyParams['num'] = 0;
            }

            //自定义时间
            if(bodyParams['customTime']){
                if(!moment(bodyParams['customTime'],"YYYY-MM-DD",true).isValid()){
                    res.json(ResultAjax.FAILED("自定义时间格式错误，如YYYY-MM-DD(1970-01-01)",{}));
                    return false;
                }
            }

            //标题
            if(bodyParams['title'].length>30){
                bodyParams['title'] = bodyParams['title'].substring(0,30);
            }
            //来源
            if(bodyParams['source'].length>30){
                bodyParams['source'] = bodyParams['source'].substring(0,10);
            }
            //简介
            if(bodyParams['summary'].length>120){
                bodyParams['summary'] = bodyParams['summary'].substring(0,120);
            }


            //默认参数
            bodyParams['type'] = '0';
            bodyParams['module'] = '3';

            //保存数据
            contentService.addContent(bodyParams,(err,data)=>{
                if(err){
                    res.json(ResultAjax.ERROR(err.message,{}));
                }else{
                    res.json(ResultAjax.SUCCESS("保存成功",data));
                }
            })
        }catch(err){
            res.json(ResultAjax.ERROR(err.message,{}));
        }
    }
}

module.exports = new NewsApi();