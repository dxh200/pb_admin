async function dxh(){
    console.log("1111");
    let random = await Math.random();
    throw  Error("这是我跑出的异常");
    return random;
}
//async返回的是Promise对象

dxh().then((val)=>{
    console.log(val+"    ||||");
}).catch((err)=>{
    console.log(err.message);
});