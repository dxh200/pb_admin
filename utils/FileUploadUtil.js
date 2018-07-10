"use strict";
const fs = require("fs");
const path = require('path');
const moment= require('moment')

class fileUploadUtil{

    constructor(){
        this.upload = this.upload.bind(this);
    }

    /**
     * 上传文件处理
     * @param req
     * @param multipartyForm
     * @param urlPath       保存地址：/upload/xxx/,前后必须/,访问路径
     * @param callback
     * @returns {Promise<void>}
     */
    async upload(req,multipartyForm,urlPath,callback){
        var _self_ = this;
        await multipartyForm.parse(req, function(err, fields, files) {
            try{
                if(err){
                    callback(err,null);
                }else{
                    //获得字段
                    var modelData = {};
                    var allFile = new Array();
                    Object.keys(fields).forEach(function(name) {
                        modelData[name] = fields[name];
                    });
                    Object.keys(files).forEach(function(name) {  //文件
                        var array = new Array();
                        var file = files[name];
                        file.forEach((__file_temp__,index)=>{
                            let originalFilename = __file_temp__.originalFilename;
                            if(!originalFilename){
                                _self_.delFiel(__file_temp__.path);
                            }else{
                                let ext = path.extname(originalFilename);  //.jpg
                                let fileName = moment().format('x')+ext;
                                var dstPath = path.join(__dirname,'./../upload/zb/'+fileName);
                                _self_.rename(__file_temp__.path,dstPath,(err)=>{
                                    if(err){
                                        _self_.delFiel(__file_temp__.path);
                                    }
                                });
                                //自定义属性
                                __file_temp__.path = path.join(multipartyForm.uploadDir,fileName);
                                __file_temp__.urlPath = urlPath+fileName;
                                __file_temp__.storeName = fileName;
                                array.push(__file_temp__);
                                allFile.push(__file_temp__);

                            }
                        });
                        modelData[name] = array;
                    });
                    modelData['allFile'] = allFile;
                    callback(null,modelData);
                }
            }catch (err) {
                //异常删除所有
                Object.keys(files).forEach(function(name) {  //文件
                    var file = files[name];
                    file.forEach((__file_temp__,index)=>{
                        _self_.delFiel(__file_temp__.path);
                    });
                });
                callback(err,null);
            }

        });
    }

    /**
     * 修改文件名称
     * @param uploadedPath 目标文件
     * @param dstPath      需要改的路径
     * @param callback
     * @returns {Promise<void>}
     */
    async rename(uploadedPath,dstPath,callback){
       await fs.rename(uploadedPath, dstPath, function(err) {
           if(err){
               callback(err)
           } else {
               callback(null)
           }
       });

    }

    //删除文件
    async delFiel(filePath){
        var delPath = path.resolve(filePath);
        console.log("delFile:"+delPath);
        await fs.unlink(delPath,(err)=>{
        });
    }

    getSuffix(str) {
        if(!str)return '';
        if (str.indexOf('.') == -1) {
            return '-1';
        } else {
            var arr = str.split('.');
            return arr.pop();
        }
    }
}

module.exports = new fileUploadUtil();