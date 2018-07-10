/**
 * 返回ajax 信息
 */
class ResultAjax{
    constructor(code,msg,data){
        this.code = code;
        this.msg = msg;
        this.data = data;
    }

    setCode(code){
        this.code = code;
        return this;
    }
    getCode(){
        return this.code;
    }
    setMsg(msg){
        this.msg = msg;
        return this;
    }
    getMsg(){
        return this.msg;
    }
    setData(data){
        this.data = data;
        return this;
    }
    getData() {
        return this.data;
    }

    getRes(){
        return {"code":this.code,"msg":this.msg,"data":this.data};
    }
}
module.exports = {
    SUCCESS:(msg,data)=>{
        if(!msg){
            msg = "success";
        }
        if(!data){
            data = {};
        }
        return new ResultAjax(0,msg,data);
    },
    FAILED:(msg,data)=>{
        if(!msg){
            msg = "failed";
        }
        if(!data){
            data = {};
        }
        return new ResultAjax(1,msg,data);
    },
    ERROR:(msg,data)=>{
        if(!msg){
            msg = "error";
        }
        if(!data){
            data = {};
        }
        return new ResultAjax(-1,msg,data);
    }
};