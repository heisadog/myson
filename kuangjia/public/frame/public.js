/**
 * Created by WFY2016 on 2017/8/23.
 */
/**
 *
 * 项目中 公用的函数 此部分不属于 框架内容
 * 大部分 以函数表达式的方式 处理（在用到的时候才执行）
 * var foo=function(){}称之为函数表达式 定义函数，function foo(){}称之为函数语句 定义函数。
 后者会预先编译；前者则必须执行后面语句后才会对foo添加调用。
 * */

var init = function () {
    wfy.tap("#dia_shade", function(_this){
        console.log(0)
        if(event.target == _this)
            this.clickHideShade();
    });
}
//获取天气
var weather = function (callback) {
    var address = wfy.getValidStr("") || "北京市";
    console.log(address)
    $.ajax({
        type: 'GET',
        url: "http://wthrcdn.etouch.cn/weather_mini?city=" + address.replace("市", ""),
        success: function (msg) {//msg这玩意是json串，不是json对象，要转！！！
            try {
                var today = JSON.parse(msg).data.forecast[0];
                var high = today.high ? today.high.replace(/[^0-9]/ig, "") : "";
                var low = today.low ? today.low.replace(/[^0-9]/ig, "") : "";
                var temp = high && low ? low + "~" + high + "℃" : "";
                //console.log(today.type + " " + temp);
                if (typeof callback === "function") callback(msg);//将msg 作为回调的参数，
            }
            catch (e) {
                //console.log("天气获取失败")
            }
        },
        error: function (info, b, c) {
            $("#weather").text("天气获取失败");
        }
    });
};
