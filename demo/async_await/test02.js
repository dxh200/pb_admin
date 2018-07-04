function sleep(second,params){
    return new Promise((resolve,reject)=>{
        setTimeout(function(){
            console.log('sleep:' + params);
            if(params=="06"){
                return reject("02执行错误")
            }
            return resolve(params)
        },second);
    })
}


async function test1(){
    let p1 =  sleep(3000,"01");  //await sleep(3000,"01");
    let p2 =  sleep(1000,"02");  //await sleep(1000,"02");

    //加入await就是等待Promise.all执行完毕，再执行console.log('等待执行完毕')
    await Promise.all([p1,p2]).then((result)=>{
        console.log('Data:'+result.toString());
    }).catch((err)=>{
        console.log('Error:'+err);
    });

    console.log('等待执行完毕')
}

test1();