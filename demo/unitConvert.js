/**
 * 单位转换
 * @param num
 * @returns {{num: number, unit: string}}
 */
function unitConvert(num) {
    var moneyUnits = ["元", "万元", "亿元", "万亿"] ;
    var dividend = 10000 ;
    var curentNum = num ;//转换数字
    var curentUnit = moneyUnits[0];
    // 转换单位
    for (var i = 0; i <4; i++) {
        curentUnit = moneyUnits[i]
        if(strNumSize(curentNum)<5){
            break;
        }
        curentNum = curentNum / dividend
    }
    var m = {num: 0, unit: ""};
    m.num = parseFloat(curentNum.toFixed(1));
    m.unit = curentUnit;
    return m
}
function strNumSize(tempNum){
    var stringNum = tempNum.toString();
    var index = stringNum.indexOf(".");
    var newNum = stringNum;
    if(index!=-1){
        newNum = stringNum.substring(0,index) ;
    }
    return newNum.length;
}

console.log(unitConvert(10000));
