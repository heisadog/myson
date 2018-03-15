/**
 * Created by WFY2016 on 2017/8/23.
 */
/*
* 存放 效果扩展 小功能效果 （依赖jQuery）
* 整体结构：
*   1》放在自执行函数内部，没有和之前那样直接定义对象，添加方法
*   2》没有采用之前在jquery上添加方法，   $.方法名
*   3》大体上根据 功能 划分几个功能区！，最后合并对象，
*   功能划分：
*      part: 事件
*      part1:基本功能 对象名 part1，以此类推 (便于搜索)
*      part2:时间相关
*      part3:数组 字符串  自身属性  扩展
*      part4 图片加载 和 加载动画
*      part5 dialog 效果大合集
*      part6 init 初始化
* */
(function (window) {
    "use strict";
    //part 事件部分
    var eventFlag = false;
    var part = {
        sta : eventFlag ? "mousedown" : "touchstart",
        end : eventFlag ? "mouseup" : "touchend",
        mov : "touchmove",
        tar : null,
    }
    part.tap = function (ele,fn) {
        $(ele).on(part.sta, function(){
            part.tar = this;
        }).on(part.end, function(){
            if(part.tar == this)
            {
                part.tar = null;
                fn(this);
            }
        }).on(part.mov, function(){
            part.tar = null;
        });
    }

    //part1 基本部分
    var part1 ={
        half :'<i style="visibility: hidden">..</i>',//半个字符
        tota :'<i style="visibility: hidden">呵呵</i>',//2个字符
        isFunc : "",//判断是否-----函数
        pwd : /^(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{6,12}$/, //密码6-16位的数字或字母,特殊符号不能使用
        tel : /^\d{11}$/, //电话
        str : "ab1cd2ef3gh4ij5kl6mn7opq8rst9uvw0xyz",//实现获取中英文随机数的
        randomNum:"",//获取的随机数
        email:/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
        len:/^\S{6,15}$/,//符合6-15位长度。是上面pwd的简单功能！
        noFun:function () {},//空函数
    };
    //替换特殊字符.这个用个是字符串对象的方法，所以穿的参数必须是 字符串！！！！！！！！谨记报错（str.replace函数未定义）
    part1.replaceAll = function(str){
        if(str!=null){
            str = str.replace(/%/g,"％");
            str = str.replace(/&/g,"＆");
            str = str.replace(/>/g,"＞");
            str = str.replace(/</g,"＜");
            str = str.replace(/\"/g,"“");
            str = str.replace(/\'/g,"‘");
            str = str.replace(/\</g,"〈");
            str = str.replace(/\>/g,"〉");
            str = str.replace(/\%/g,"％");
            str = str.replace(/\#/g,"＃");
            str = str.replace(/\	/g,"，");
            str = str.replace(/(^\s*)|(\s*$)/g,''); //去两端的空格
        }
        return str;
    };
    //取有效字符串
    part1.getValidStr = function(str){
        str += "";
        if (str == "undefined" || str == "null" || str.toUpperCase() == "NULL")
            return "";
        else
            return    part1.replaceAll(str);//------------------------!!!!!!!!!!!!!!!----------------------
    };
    //判断是否是否函数
    part1.isfunction = function(v){
        eval("part1.isFunc = typeof(" + v + ") === \"function\"");
        return part1.isFunc;
    };
    //对于电商项目的价格 设置保留n个小数<如果只传一个参数就默认的保留2位小数>
    part1.setTwoNum = function(price,n){
        if(price<0){ price = 0 };
        return  isNaN(price) ? 0 : (part1.empty(n) ? new Number(price).toFixed(2) : new Number(price).toFixed(n));
    };
    //四舍五入取整数（保存几位）Math.round(price)
    //获取随机数（中英文都有的）
    /*getRnd  默认两个参数，第一个参数传数字，表示位数。
     *        第二个参数可不写，是布尔型，true和false都行。加上这个参数表示纯数字的随机数
     */
    part1.getRnd = function(n,blean){
        if(blean == "" || blean == true || blean == false){
            for(var i = 0; i < n; i++){
                part1.randomNum += Math.floor(Math.random()*10);
            }
        }else{
            for(var i = 0; i < n; i++)
            {
                var j = parseInt(part1.str.length * Math.random());
                part1.randomNum += part1.str.charAt(j);
            }
        }
        return part1.randomNum;
    };

    //--------------------------------------页面跳转--------------------------------------------
    //html页面跳转。加了随机数.这里默认设置了四位随机数,并传参（注意，appcan打包成app，随机数和参数都没法获取到）
    part1.goto = function(url, para)
	{
		setTimeout(function(){
            location.href = (url || 'home') + '.html?rnd=' + part1.getRnd(4)+(part1.empty(para) ? "":'&pid='+para);
        }, 200)
	};
    part1.goBack = function () {
        var url = localStorage.getItem("prev"); // 上一页配置
        url ? part1.goto(url) : history.back();
    }
    //针对某些打包工具，没法传参的情况，换种思路传参：先将参数本地存储，在执行页面跳转
    part1.pagegoto = function (url, para) {
        setTimeout(function () {
            localStorage.setItem('pagepara', JSON.stringify(para || ''));
            if (page === -1) {
                history.back();
            } else {
                location.href = (url || 'home') + '.html?rnd=' + part1.getRnd(4);
            }
        },200)
    }
    /**
     * 返回上一页（由localStorage.prev设置）
     * @param param 传参
     */
    part1.pageBack = function (param) {
        var page = localStorage.getItem('prev');
        part1.pagegoto(page || -1, param);
    };
    /**
     * 获取当前页面名
     * @returns {string} 比如app/stock.html-》得到 stock
     */
    part1.pageName = function () {
        var href = location.href.split('/');
        var page = href.slice(href.length - 1, href.length).toString().split('.');
        return page.slice(0, 1).toString();
    };
    //判断是否对象 并转成对象
    part1.tojson = function(s){
        //直接用 JSON.parse(msg) 即可
    }
    //优化 封装 for循环，减少页面js
    part1.newfor = function(list,fun){
        var len = list.length;
        if(len == 0){
            return part1.zero();
        }
        var html = "";
        for(var i = 0; i < len; i++){
            var r = typeof(list[i]) == "object" ? list[i] : $.tojson(list[i]);
            html += fun(r, i);
        }
        return html;
    }
    // 返回字符串的实际长度, 一个汉字算2个长度
    part1.strlen = function(str){
        return str.replace(/[^\x00-\xff]/g, "**").length;
    }
    //字符串超出省略   len 取双倍！比如要截取三个字 那么设置len参数为6  默认长度设置10吧
    part1.cutstr = function(str,len){
        len = len || 10;
        var restr = str;
        var wlength = str.replace(/[^\x00-\xff]/g, "**").length;
        if (wlength > len) {
            for (var k = len / 2; k < str.length; k++) {
                if (str.substr(0, k).replace(/[^\x00-\xff]/g, "**").length >= len) {
                    restr = str.substr(0, k) + "...";
                    break;
                }
            }
        }
        return restr;
    }
    part1.empty = function (cont) {
        return cont == null || typeof(cont) == "undefined" || cont == "undefined" || cont == "" ? true : false;//区分于之前的empty ，并修改逻辑思维
    }
    part1.zero =function (str) {
        return '<div class="selectNone">'+ (str || "暂无查询数据")+'</div>'
    }
    part1.visibility = function (str) {
        //列表名称 要求对齐，不够四个字的中间空格 填充---------以及2个字三个字的姓名----------
        var strlen = str.length;
        if(strlen == 4){
            return str;
        }
        if(strlen == 3){
            var strarr = str.split("");
            return strarr[0]+part1.half+strarr[1]+part1.half+strarr[2];
        }
        if(strlen == 2){
            var strarr = str.split("");
            return strarr[0]+part1.tota+strarr[1];
        }
    }
    part1.visiname = function (str) {//名字
        var strlen = str.length;
        if(strlen == 3){
            return str;
        }
        if(strlen == 2){
            var strarr = str.split("");
            return strarr[0]+part1.half+part1.half+strarr[1];
        }
    }
    /**
     * 数组根据数组对象中的某个属性值进行排序的方法
     * 使用例子：newArray.sort(sortBy('number',false)) //表示根据number属性降序排列;若第二个参数不传递，默认表示升序排序
     * var resarr = re.sort(wfy.sortBy('kcssje',false));//从大大小排列
     * @param attr 排序的属性 如number属性
     * @param rev true表示升序排列，false降序排序
     * */
    part1.sortBy = function(attr,rev){
        //第二个参数没有传递 默认升序排列
        if(rev ==  undefined){
            rev = 1;
        }else{
            rev = (rev) ? 1 : -1;
        }
        return function(a,b){
            a = a[attr];
            b = b[attr];
            if(a < b){
                return rev * -1;
            }
            if(a > b){
                return rev * 1;
            }
            return 0;
        }
    }
    // part2 时间部分
    /*/*
     *获取本年、本季度 、本周、本月、上月的开始日期、结束日期
     * 思路：
     * 1.首先 new Date() 一个获取当前的时间（年 月 日 周）
     * 2.设置一个公用的 函数：获取当前月的天数 getMonthDays()
     * 3.得到 开始日期a   结束日期b
     * 4.重点： 重新new Date(),这次参数a 或者 b 传进去、得到新的时间对象c。
     * 5.再设置一个公用的函数。对新的时间对象c进行格式上的处理。得到我们想要的 。
     * 6.总结就是 new Date()得到区间   --》setDate()设置--》 重新 new Date(待参数)--》处理格式，项目中使用
     * 7.注意：刚开始 我在写的时候 。还考虑到 跨年 跨月  30天 31天等 因素。忽略了Date对象会自动处理的会自动处理......
     * 2017-1-10
     *
     * */
    var now = new Date(); //当前日期
    var pre = new Date(); //上月日期
    pre.setDate(1);//设置为1号
    pre.setMonth(pre.getMonth()-1);//设置为 上个月；这里的-1 不需要处理。相当于pre = new Date("2013 12 12")形式
    //因为 -1后进入另外一个月或一年，Date对象会自动处理的。天数也是如此
    var time ={
        now:now, //当前日期
        nowDay:now.getDate(), //当前日
        nowDayOfWeek:now.getDay(),//今天本周的第几天 返回值是 0（周日） 到 6（周六） 之间的一个整数。
        nowMonth:now.getMonth(),//当前月  返回值是 0（一月） 到 11（十二月） 之间的一个整数。
        nowYear: now.getFullYear(),//当前年 getYear()	请使用 getFullYear() 方法代替。
        preYear:pre.getFullYear(),//上个月的年份
        preMonth:pre.getMonth(),//上个月的月份
        //格式化日期：通用的，处理成 yyyy-MM-dd 格式，用于项目中 yinwie
        //因为 new Date 获取的时间 格式没法直接在项目中使用--
    };
    var part2 = {
        //获取当前时间。并自定义时间 连接格式 / - . 默认 用-

        format : function (fmt, date) {
            fmt = (fmt || '') + '';
            date = new Date(date || new Date());
            var map = {};
            map['M+'] = date.getMonth() + 1;
            map['d+'] = date.getDate();
            map['h+'] = date.getHours();
            map['m+'] = date.getMinutes();
            map['s+'] = date.getSeconds();
            map['q+'] = Math.floor((date.getMonth() + 3) / 3);
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
            if (/(W+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, ['日', '一', '二', '三', '四', '五', '六'][date.getDay()]);
            if (/(S+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, date.getMilliseconds() + '');
            for (var key in map)
                if (new RegExp('(' + key + ')').test(fmt))
                    fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? map[key] : ('00' + map[key]).substr(('' + map[key]).length));
            return fmt;
        },
        timestyle:function(str,model){// 有时候，从后台穿过来的 时间没有连接符号。全是一串数字。为了好看。添加连接符。默认为 -
            var str1 =str.slice(0,4);
            var str2 =str.slice(4,6);
            var str3 =str.slice(6,8);
            return str1+(model ||"-")+str2+(model ||"-")+str3;
        },
        formatDate:function(date){
            var myyear = date.getFullYear();
            var mymonth = date.getMonth()+1;
            var myweekday = date.getDate();
            if(mymonth < 10){
                mymonth = "0" + mymonth;
            }
            if(myweekday < 10){
                myweekday = "0" + myweekday;
            }
            return (myyear+"-"+mymonth + "-" + myweekday); //----------
        },
        ////获得今年 某月的天数   nowYear用的是now当前的
        getMonthDays:function(myMonth){
            var monthStartDate = new Date(time.nowYear, myMonth, 1); // 本月的第一天  格式 ：2016 01 01
            var monthEndDate = new Date(time.nowYear, myMonth + 1, 1); //下个月的第一天  相减得到天数的毫秒
            var days = (monthEndDate - monthStartDate)/(1000 * 60 * 60 * 24); //
            return days;
            //console.log(time.getMonthDays(8)) 注意 参数是从0开始的  8标识 第9个月
        },
        //获取当前 季度的 开始 月份
        getQuarterStartMonth:function(){
            var quarterStartMonth = 0;
            if(time.nowMonth<3){
                quarterStartMonth = 0;
            }
            if(2<time.nowMonth && time.nowMonth<6){
                quarterStartMonth = 3;
            }
            if(5<time.nowMonth && time.nowMonth<9){
                quarterStartMonth = 6;
            }
            if(time.nowMonth>8){
                quarterStartMonth = 9;
            }
            return quarterStartMonth;
        },
        //获取 本周 开始 日期
        getWeekStartDate:function(){
            //nowDayOfWeek本周第几天
            //nowDay 本月的日期。减去 本周已经过了的天数。得到 本周开始的日期格式。
            //然后 new Date
            var weekStartDate = new Date(time.nowYear, time.nowMonth, time.nowDay - time.nowDayOfWeek);
            //console.error(weekStartDate)  得到：time.js:41 Sun Jan 08 2017 00:00:00 GMT+0800 (中国标准时间)
            return part2.formatDate(weekStartDate);
        },
        //获取本周 结束 的日期
        getWeekEndDate:function(){
            var weekEndDate = new Date(time.nowYear, time.nowMonth, time.nowDay + (6 - time.nowDayOfWeek));
            return part2.formatDate(weekEndDate);
        },
        //获取本月的 开始 日期
        getMonthStartDate:function(){
            var monthStartDate = new Date(time.nowYear,time.nowMonth,1);
            return part2.formatDate(monthStartDate);
        },
        //本月 结束  时间
        getMonthEndDate:function(){
            var monthEndDate = new Date(time.nowYear, time.nowMonth, part2.getMonthDays(time.nowMonth));
            return part2.formatDate(monthEndDate);
        },
        //上个月的 开始 日期
        getPreMonthStartDate:function(){
            var preMonthStartDate = new Date(time.preYear,time.preMonth,1);
            return part2.formatDate(preMonthStartDate);
        },
        //上个月的 结束 日期
        getPreMonthEndDate:function(){
            var preMonthEndDate = new Date(time.preYear,time.preMonth,part2.getMonthDays(time.preMonth));
            return part2.formatDate(preMonthEndDate);
        },

        //本季度的 开始日期
        getQuarterStartDate:function(){
            var quarterStartDate = new Date(time.nowYear, part2.getQuarterStartMonth(), 1);
            return part2.formatDate(quarterStartDate);
        },
        //本季度的 结束 日期
        getQuarterEndDate:function(){
            var quarterEndMonth = part2.getQuarterStartMonth() + 2;
            var quarterStartDate = new Date(time.nowYear, quarterEndMonth, part2.getMonthDays(quarterEndMonth));
            return part2.formatDate(quarterStartDate);
        },
        //年的开始 就简单了 由年份 直接拼写吧
        getYearStartDate:function(){
            return time.nowYear+"-01"+"-01";
        },
        getYearEndDate:function(){
            return time.nowYear+"-12"+"-31";
        },
        //获取某个日期num天后的 日期
        getNextDay:function(time,num){
            var d = new Date(time).getTime();
            d = d + 1000*60*60*24*num;
            d = new Date(d);
            return part2.formatDate(d);
            //return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
        },
        //获取某个日期num前后的 日期
        getPreDay:function(time,num){
            var d = new Date(time).getTime();
            d = d - 1000*60*60*24*num;
            d = new Date(d);
            return part2.formatDate(d);
        }
    };
    //part3
    /**
     * 扩展javascript中功能，使用方法：和javascript中原生函数一样的使用！！如  数组.方法
     * 在 原型链上添加方法！
     * 字符串 ...等 也可以
     */
    /**
     * javascript的数组函数中，没有直接删除   值  的函数方法。
     *就定一个 可以实现直接删除值得的方法---操作原有的数据
     * 原理：通过元素值  先找到该元素的索引。然后用array自带的删除函数实现！！
     * 目的：用的时候，方便....
     */
    // 日期格式化
    Date.prototype.format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };
    //使用 new Date().format("yyyy-MM-dd")---直接获取当前日期
    //获取 数组中 某个值得索引(5.3补充：这么写仅适应与不带重复值的数组)
    Array.prototype.getindex = function(val){
        for(var i = 0; i<this.length; i++){ //这里的this是值得注意的地方！这里本是参数！
            //如果写val那么就报错 val未定义！
            //专门用this代指！！！！！！
            if(this[i] == val){
                return i;
            }
        }
    }
    //删除 数组中的 某个 值
    Array.prototype.remove = function(val){
        var index = this.getindex(val);
        this.splice(index, 1); //splice是数组自带的函数,会改变 原数组！
    }
    //5.3 升级：上面的remove方法，如果遇到删除的值 存在多个，并不能实现，换个思路：使用 辅助数组，将将删除值之外的值添加到数组中。
    Array.prototype.removeVal = function(val){
        var tem = new Array();
        for (var i = 0; i < this.length; i++) {
            if((this[i] != val) && (tem.indexOf(this[i]) == -1)){
                tem.push(this[i])
            }
        }
        console.log(tem);
        return tem;//需要对原数组 重新 赋值！！！！！！！！！！
    }
    //判断某个值是否在数组中  （索引的）
    Array.prototype.val_in_array = function (val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val)
                return true;
        }
        return false;
    }
    // 判断 某个键 是否 存在 （）
    Array.prototype.key_in_array = function(k){
        var arr =[];
        for(var key in this){
            //取得 所有的 key值 组成一个新的 数组；
            arr.push(key);
        }
        if(arr.val_in_array(k)){
            return true;
        }else{
            return false;
        }
    }
    //判断某个值在数组中的位置
    Array.prototype.indexOf = function (e) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == e)
                return i;
        }
        return -1;
    }
    //判断了两个数组共同拥有的值。并删除
    Array.prototype.del_common =function(arr){
        for (var i = 0; i < arr.length; i++) {
            if (this.val_in_array(arr[i])) {
                this.remove(arr[i]);
                arr.remove(arr[i]);
            }
        }
    }
    // 返回字符串的实际长度, 一个汉字算2个长度
    String.prototype.strlen = function () {
        return this.replace(/[^\x00-\xff]/g, "**").length;
    }
    //字符串超出省略   len 取双倍！比如要截取三个字 那么设置len参数为6
    String.prototype.cutstr = function (len) {
        var restr = this;
        var wlength = this.replace(/[^\x00-\xff]/g, "**").length;
        if (wlength > len) {
            for (var k = len / 2; k < this.length; k++) {
                if (this.substr(0, k).replace(/[^\x00-\xff]/g, "**").length >= len) {
                    restr = this.substr(0, k) + "...";
                    break;
                }
            }
        }
        return restr;
    }
     //替换全部
    String.prototype.replaceAll = function (s1, s2) {
        return this.replace(new RegExp(s1, "gm"), s2)
    }
     //字符串去空格
    String.prototype.trim = function () {
        return this.replace(/(^\s*)|(\s*$)/g, "");
    }
    String.prototype.trimAll = function () {
        return this.replace(/\s+/g, "");
    }
    String.prototype.lTrim = function () {
        return this.replace(/(^\s*)/g, "");
    }
    String.prototype.rTrim = function () {
        return this.replace(/(\s*$)/g, "");
    }
     //判断是否以某个字符串开头
    String.prototype.startWith = function (s) {
        return this.indexOf(s) == 0
    }
     //判断是否以某个字符串结束
    String.prototype.endWith = function (s) {
        var d = this.length - s.length;
        return (d >= 0 && this.lastIndexOf(s) == d)
    }

    //part4 图片加载和 加载动画
    var defaults = {
        loadingimg : "../img/onerror.gif",
        errorimg : "../img/onerror.jpg",
        imgSrc : "http://www.senmart.cn/d/file/china/product/2016-07-20/"//这里需要改
    };
    var part4 ={
        "imgload":function(imgsrc,element){
            var imgs = new Image();
            if($.empty(imgsrc))
            {
                imgs.src = imgsrc.indexOf("http") == 0 ? src : defaults.imgSrc + src;
                imgs.onload = function()
                {
                    $(element).attr("src", imgs.src)
                }
                imgs.onerror = function()
                {
                    $(element).attr("src", defaults.loadingimg)
                }
            }
        },
        "showload":function(cont){
            /*
             *整的思路。html中有div作为背景图 ，给该元素添加 动画div
             *<div id="loadingBg" class="loadingBg"></div>这是页面 固定的调用div
             * 07-04-13补充：<div id="loadingBg" class="loadingBg">放在页面中会导致形成遮罩！！！无法操作，所以，这个也要放在js中！
             * showload()可自带参数。例如：正在登陆  默认是 数据加载中
             * 调用 例如$.showload("哈哈哈哈");
             * 07-06-09 考虑到一直有遮罩。无法操作。可以将背景的top 空余顶部，可以操作顶部的返回按钮
             * */
            var html = '<div id="loadingBg" class="loadingBg"><div class="loadbox loadboxshow" id="loadbox"><div class="weui_loading">';
            for(var i=0;i<12;i++){
                html +='<div class="weui_loading_leaf weui_loading_leaf_'+i+'"></div>';
            }
            html +='</div><p class="weui_toast_content">'+ (cont || "数据加载中") +'</p></div></div>';
            $(""+html).appendTo(document.body);
            $("#loadingBg").show();
        },
        "hideload":function(){
            $("#loadingBg").remove();
        }
    }

    //part5 dialog效果
    /*
     *总结 项目中常用的 几种 弹窗 需求
     * slide 滑动 shade 遮罩 confirm
     * */
    var part5 = {
        shade:'<div class="dia_shade" id="dia_shade"></div>',    //遮罩层 shade  动画效果：先添加dom节点，然后透明度有0 变0.6，执行透明度动画效果
        showShade:function () {
            //遮罩层 出现
            var $shade = $(''+this.shade);
            //console.log(this.tota)//内部调用 this， 他指向 整个wfy对象
            setTimeout(function () {
                if($(".dia_shade").length == 0){
                    $("body").append($shade);
                }
            },0)//？？这个地方如不用setTimeout 处理一下 ，当点击出现遮罩层的时候，会触发遮罩层的消失事件！！！！
        },
        hideShade:function () {//遮罩层 消失
            $(".dia_shade").addClass("dia_shade_hide");
            setTimeout(function () {
                $(".dia_shade").remove();
            },200)
        },
        slideModle:function (html) {
            //弹出层 div结构,原理是先y轴位移。需要显示的时候 清除位移，达到动画效果
            //return '<div class="dia_slideModle">'+html+'</div>';
            return $(''+'<div class="dia_slideModle y100">'+html+'</div>');//改进一下 直接返回 dom节点。删除的时候 直接移除
        },
        slideTopConfirm:function (title,callback) {
            //仿微信效果，删除的时候，底部弹出一个 选项，删除或者取消。类似confirm效果
            var html = '<div class="dia_cont">' +
                '<div class="dia_cont_tip borbot">'+(title || "您确定要进行此操作？")+'</div>'+
                '<div class="dia_cont_tip dia_cont_delete">删除</div>'+
                '<div class="dia_line_10"></div>'+
                '<div class="dia_cont_tip dia_cont_cancle">取消</div>'+
                '</div>';

            this.showShade();
            var $dom = this.slideModle(html);
            if($(".dia_slideModle").length ==0){
                $("body").append($dom);
            }
            setTimeout(function () {
                $dom.removeClass('y100');
            },100)
            
            document.body.addEventListener('touchstart', part1.noFun());
            $('.dia_cont_delete').on("click",function () {
                $dom.addClass("y100");
                setTimeout(function () {
                    $dom.remove();
                },100)
                part5.hideShade();
                if ( typeof callback === 'function') {
                    callback();
                }
            })
            $(".dia_cont_cancle").on("click",function(){
                $dom.addClass("y100");
                setTimeout(function () {
                    $dom.remove();
                },100)
                part5.hideShade();
            })
        }
    };
    /*------------------------------------------part6  init-------------------------*/
    var part6 ={
        init:function () {
            wfy.tap("#dia_shade", function(_this){
                part5.hideShade();
            });
        }
    }
    var wfy = {};

    wfy= $.extend(part,part1,part2,part4,part5,part6)
    window.wfy = wfy;
    /*
    * 小提示：
    * 其一：这样写 外界是无法直接调用 part5.showShade()的、
    * 其二：@@在part5.showShade() 内部调用 this， 他指向 整个wfy对象。
    * */
})(window)









































