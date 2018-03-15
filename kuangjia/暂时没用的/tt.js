/*变量 用v 表示 variables 
 *数量 用	n  表示数量
 * part1 基础部分
 * part2 图片加载 和 加载动画
 * part3 模仿 app的滑动进入到下一个页面
 * part4 时间 相关
 * part5 数组 字符串  自身属性  扩展
 * part6 tap等 手机端各种 事件  点击 双击 长安 左右滑动等等、、、、
 * part7 alert confirm  prompt 的美化
 * */
;(function($){
	"use strict";
//	$.fn.extend({
//		"empty":function(v){
//			return s == null || typeof(s) == "undefined" || s == "undefined" || s == "" ? false : true;
//		}
//	})
//	$.fn.empty = function(v){
//		return s == null || typeof(s) == "undefined" || s == "undefined" || s == "" ? false : true;
//	}
	/*插件开始的第一步，上述2种写法都有一样，都是给jquery对象添加。个人比较喜欢第二个
	 *这里遇到一个问题。这个自定的empty怎么调用。
	 * 调用原则：和jquery 一样$("#id").函数名(参数);但是在这里我犯了点迷糊
	 * 像empty这个函数功能 有时候不需要主体事件（像typeof(s)在一个函数语句中执行的），我一下子不知道怎么调用了
	 * 原来 还有一种调用方法：  $.函数名(参数)
	 * so 这样的地方 我这样alert($.fn.empty(s))，
	 * 上述方法 给jquery对象添加   每次写都有个fn。 下面的部分还是改成给jquery本身 添加拓展方法吧!
	 * 给 jquery对象添加 可以像 jQuery 那样方式调用
	 * */
	
})(jQuery)
/*
 *学着其他框架 用+ 继续扩展其他的部分 
 *上述部分仅是小试牛刀，项目功能收集开始（除jqueryweui带有的功能）
 * */
//part1
+function($){
	"use strict";
	var basic={
		isFunc : "",//判断是否-----函数
		pwd : /^(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{6,12}$/, //密码6-16位的数字或字母,特殊符号不能使用
	    tel : /^\d{11}$/, //电话
	    str : "ab1cd2ef3gh4ij5kl6mn7opq8rst9uvw0xyz",//实现获取中英文随机数的
	    randomNum:"",//获取的随机数
	    email:/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
	    len:/^\S{6,15}$/,//符合6-15位长度。是上面pwd的简单功能！
	    lens:/^\d{15}$|^\d{18}$/,//15位或者18位的长度
	};
	//替换特殊字符.这个用个是字符串对象的方法，所以穿的参数必须是 字符串！！！！！！！！谨记报错（str.replace函数未定义）
	$.replaceAll = function(str){
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
	$.getValidStr = function(str){
		str += "";
		if (str == "undefined" || str == "null" || str.toUpperCase() == "NULL")
			return "";
		else
			return    $.replaceAll(str);//------------------------!!!!!!!!!!!!!!!----------------------
	};
	//判断是否是否函数
	$.isfunction = function(v){
		eval("basic.isFunc = typeof(" + v + ") === \"function\"");
		return basic.isFunc;
	};
//	//进行判断返回true或false
	$.empty = function(n){
		return n == null || typeof(n) == "undefined" || n == "undefined" || n == "" ? false : true;
	};
	//对于电商项目的价格 设置保留n个小数<如果只传一个参数就默认的保留2位小数>
	$.setTwoNum = function(price,n){
		if(price<0){ price = 0 };
		return  isNaN(price) ? 0 : ($.empty(n) ? new Number(price).toFixed(n) : new Number(price).toFixed(2));
	};
	//四舍五入取整数（保存几位）Math.round(price)
	
	//获取随机数（中英文都有的）
	/*getRnd  默认两个参数，第一个参数传数字，表示位数。
	 *        第二个参数可不写，是布尔型，true和false都行。加上这个参数表示纯数字的随机数
	 */
	$.getRnd = function(n,blean){
		if(blean == "" || blean == true || blean == false){
			for(var i = 0; i < n; i++){
				basic.randomNum += Math.floor(Math.random()*10);
			}
		}else{
			for(var i = 0; i < n; i++)
			{
				var j = parseInt(basic.str.length * Math.random());
				basic.randomNum += basic.str.charAt(j);
			}
		}
		return basic.randomNum;
	};
	//同一父文件下的html页面跳转。加了随机数.这里默认设置了四位随机数
	$.pagegoto = function(url){
		setTimeout(function(){
			location.href = url + ".html?rnd=" + $.getRnd(4);
		},300)
	}
	//做数据查询的时候，经常 要加个判断；当数据为0的时候  提示：没有查到数据等...
	$.zero = function(){
		return "<div>这里没查到数据</div>	"
	}
	//判断是否对象 并转成对象
	$.tojson = function(s){
		try{
			eval("var v = " + s);
			return v;
		}catch(e){
			return s;
		}
	}
	//优化 封装 for循环，减少页面js
	$.newfor = function(list,fun){
		var len = list.length;
		if(len == 0){
			return $.zero();
		}
		var html = "";
		for(var i = 0; i < len; i++){
			var r = typeof(list[i]) == "object" ? list[i] : $.tojson(list[i]);
			html += fun(r, i);
		}
		return html;
	}
	// 返回字符串的实际长度, 一个汉字算2个长度 
	$.strlen = function(str){
		return str.replace(/[^\x00-\xff]/g, "**").length;  
	}
	//字符串超出省略   len 取双倍！比如要截取三个字 那么设置len参数为6
    $.cutstr = function(str,len){
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
    
    
}(jQuery)

//part2 图片加载和 加载动画
+function($){
	var defaults = {
		loadingimg : "../img/onerror.gif",
    	errorimg : "../img/onerror.jpg",
    	imgSrc : "http://www.senmart.cn/d/file/china/product/2016-07-20/"//这里需要改
	};
	$.extend({
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
	});
}($)

//part3 模拟动画 进入到下一个页面。封装的很low  哈哈！ 仅仅是实现了效果
/*
 *模仿jquerymobile的样子 ，所有的涉及到跳转的页面 都在一个html实现！！ 
 * 页面的结构是固定的 
 * <div data-panel="panel" id="pageone" class=" panel">
    <div class="page">
      
    </div>
   </div>
   <div data-panel="panel" id="pagetwo" class="none panel">
    <div class="page">
      
    </div>
   </div>
 * 多个 panel类名，仅显示一个。 根据panel的id 进行跳转
 * */
+function($){
	$.extend({
		slidenext:function (nowpage,nextpage) {
	        var nowpage = nowpage;
	        var nextpage =nextpage;
	        $("#"+nextpage).addClass("slideLft100").removeClass("none");
	        $("#"+nowpage).addClass("slideLft10");
	        setTimeout(function () {
	            $("#"+nowpage).addClass("none");
	            //上面加入的css执行了动画后。在去掉该css；保证最初的状态！
	            $("#"+nextpage).removeClass("slideLft100");
	            $("#"+nowpage).removeClass("slideLft10");
	        },200)
	    },
	    slideback:function (nowpage,nextpage) {
	        var nowpage = nowpage;
	        var nextpage =nextpage;
	        $("#"+nextpage).removeClass("none");//待返回的页面作为nextpage。先让他显示
	        $("#"+nowpage).addClass("goback");//当前页面 加上 划动效果
	        setTimeout(function () {
	            $("#"+nowpage).addClass("none");
	            $("#"+nowpage).removeClass("goback");
	        },300)
	    },
	});
}($)

//part4 时间相关
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
+function($){
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
    $.extend({
		//获取当前时间。并自定义时间 连接格式 / - . 默认 用-
		// 有时候，从后台穿过来的 时间没有连接符号。全是一串数字。为了好看。添加连接符。默认为 - 
		timestyle:function(str,model){
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
			return $.formatDate(weekStartDate); 
		},
		//获取本周 结束 的日期
		getWeekEndDate:function(){
			var weekEndDate = new Date(time.nowYear, time.nowMonth, time.nowDay + (6 - time.nowDayOfWeek));
			return $.formatDate(weekEndDate); 
		},
		//获取本月的 开始 日期 
		getMonthStartDate:function(){
			var monthStartDate = new Date(time.nowYear,time.nowMonth,1);
			return $.formatDate(monthStartDate); 
		},
		//本月 结束  时间
		getMonthEndDate:function(){
			var monthEndDate = new Date(time.nowYear, time.nowMonth, $.getMonthDays(time.nowMonth)); 
	        return $.formatDate(monthEndDate); 
		},
		//上个月的 开始 日期
		getPreMonthStartDate:function(){
			var preMonthStartDate = new Date(time.preYear,time.preMonth,1);
			return $.formatDate(preMonthStartDate); 
		},
		//上个月的 结束 日期
		getPreMonthEndDate:function(){
			var preMonthEndDate = new Date(time.preYear,time.preMonth,$.getMonthDays(time.preMonth));
			return $.formatDate(preMonthEndDate); 
		},
		
		//本季度的 开始日期
		getQuarterStartDate:function(){
			var quarterStartDate = new Date(time.nowYear, $.getQuarterStartMonth(), 1); 
	        return $.formatDate(quarterStartDate); 
		},
		//本季度的 结束 日期
		getQuarterEndDate:function(){
			var quarterEndMonth = $.getQuarterStartMonth() + 2; 
			var quarterStartDate = new Date(time.nowYear, quarterEndMonth, $.getMonthDays(quarterEndMonth)); 
			return $.formatDate(quarterStartDate);
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
			return $.formatDate(d);
			//return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
		},
		//获取某个日期num前后的 日期
        getPreDay:function(time,num){
            var d = new Date(time).getTime();
            d = d - 1000*60*60*24*num;
            d = new Date(d);
            return $.formatDate(d);
        }
	});
}($)

+function($){
	/**
	 *生成uuid  生成uuid的方法很多，可视需求而定！！
	 */
	$.getUuid = function(){
		var s = [];
		var hexDigits = "0123456789abcdefghijklmnopqrstuvwxyz";
		for (var i = 0; i < 36; i++) {
			s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
		}
		s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
		s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the
		// clock_seq_hi_and_reserved
		// to 01
		s[8] = s[13] = s[18] = s[23] = "";

		var uuid = s.join("");
		return "AjaxModel_" + uuid;
	}
}(jQuery)
/**
 * part5 数组 字符串  自身属性  扩展  (prototype)  
 */
+function($){
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
        for (i = 0; i < this.length; i++) {  
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
        for (i = 0; i < this.length; i++) {  
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
}(jQuery)
/*
 *part6 各种事件的封装
 *  
 * */
+function($){
	$.extend({
		/*单次触摸事件*/
		tap:function(dom,callback){
			var isMove = false;
	        var startTime = 0;
	        $(dom).on('touchstart',function(){
	        	startTime = Date.now();
	        }).on('touchmove',function(){
	        	isMove = true;
	        }).on('touchend',function(){
	        	if(!isMove && (Date.now()-startTime) < 250){
	                /*调用 callback*/
	                callback && callback(this);//
	            }
	            /*重置 参数*/
	            isMove = false;
	            startTime = 0;
	        })
		},
	})
}(jQuery)
/*
 * part7 lert confirm  prompt 的美化
 */
+function($){
	//var butHtml = 0;直接用var定义 是获取不到的页面，要像下面那样前台html才能获取
	$.butHtml ='<div class="dialog_but">确定</div><div class="dialog_but dialog_foot_line">取消</div>';
	$.htmlModel = function(html){//基本的html样式
		var htmlModel ="";
		htmlModel = '<div class="tt-alertbg "></div>'+
			'<div class="tt-alertbox ">'+(html || "")+
			'<div class="dialog_foot">'+$.butHtml+
			'</div>'+
			'</div>';
		return htmlModel;
	}
	$.showhModel = function(html){
		$(html).appendTo(document.body);
		setTimeout(function(){
			$(".tt-alertbg").addClass("showdialog");
			$(".tt-alertbox").addClass("showdialogbox");
		},200)
	}
	$.closeModel = function(){
		$(".tt-alertbg").removeClass("showdialog");
		$(".tt-alertbox").removeClass("showdialogbox");
		setTimeout(function(){
			$(".tt-alertbg,.tt-alertbox").remove();
		},300)
	}
	$.prompt = function(title,callbackOk,callbackCancel){
		if(typeof title === 'function'){
			callbackOk = arguments[0];
			callbackCancel =arguments[1];
			title = undefined; //这里是关键！！如果只有前2个回调作为参数，title要在后面最后定义
		}
		var promptHtml ='<div class="dialog_body">'+(title || "请输入信息")+'</div>'+
			'<div class="dialog_body"><input value="" class="dialog_input" /></div>';
		var html = $.htmlModel(promptHtml);
		$.showhModel(html);
		$(".dialog_but").each(function(i){
			$(".dialog_but").eq(i).click(function(cal){
				var val = $(".dialog_input").val();
				console.log(val)
				if(i == 0){
					if (typeof callbackOk === 'function') {
						$.closeModel()
                    //将取到的输入值 作为参数 传进去用法实例
                    /*
                     *$.confirm(fun1,fun2)
						   	function fun1(a){
						   		alert(a) //此时的a就是输入值 ，
						   	}
						   	function fun2(a){
						   		alert(a)
						   	}
                     * 
                     * */
					};
				}
				if(i == 1){
					if (typeof callbackCancel === 'function') {
						$.when(callbackCancel(val)).done($.closeModel());
					};
				}
			})
		})
	}
	$.confirm = function(title,callbackOk,callbackCancel){
		if(typeof title === 'function'){
			callbackOk = arguments[0];
			callbackCancel =arguments[1];
			title = undefined;
		}
		var confirmHtml ='<div class="dialog_body">警告</div>'+
			'<div class="dialog_body">'+(title|| "您确定要删除此条信息吗" )+'</div>';
		var html = $.htmlModel(confirmHtml);
		$.showhModel(html);
		$(".dialog_but").each(function(i){
			console.log(i)
			$(".dialog_but").eq(i).click(function(cal){
				if(i == 0){
					if (typeof callbackOk === 'function') {
						if (cal) {$.closeModel()} 
					};
				}
				if(i == 1){
					if (typeof callbackCancel === 'function') {
						if (cal) {$.closeModel()} 
					};
				}
			})
		})
	}
	$.alert = function (title,callback) {
		if(typeof title === 'function'){
			callback = arguments[0];
			title = undefined;
		}
		$.butHtml='<div class="dialog_but dialog_but_alert">确定</div>';
		var alertHtml ='<div class="dialog_body">提示</div>'+
			'<div class="dialog_body">'+(title || "操作成功" )+'</div>';
		var html = $.htmlModel(alertHtml);
		$.showhModel(html);
		$(".dialog_but").click(function () {
			if (typeof callback === 'function') {
				$.when(callback()).done($.closeModel());
			};
		})
	}
}(jQuery)
+function($){
	//文本输入框 的高度 随内容增加
    $.fn.autoTextarea = function(options) {
        var defaults={
            maxHeight:null,//文本框是否自动撑高，默认：null，不自动撑高；如果自动撑高必须输入数值，该值作为文本框自动撑高的最大高度
            minHeight:$(this).height() //默认最小高度，也就是文本框最初的高度，当内容高度小于这个高度的时候，文本以这个高度显示
        };
        var opts = $.extend({},defaults,options);
        return $(this).each(function() {
            $(this).bind("paste cut keydown keyup focus blur",function(){
                var height,style=this.style;
                this.style.height =  opts.minHeight + 'px';
                if (this.scrollHeight > opts.minHeight) {
                    if (opts.maxHeight && this.scrollHeight > opts.maxHeight) {
                        height = opts.maxHeight;
                        style.overflowY = 'scroll';
                    } else {
                        height = this.scrollHeight;
                        style.overflowY = 'hidden';
                    }
                    style.height = height  + 'px';
                }
            });
        });
    };
}(jQuery);

+function($){
	$.fn.myPlugins = function() {
    //在这里面,this指的是用jQuery选中的元素
    this.css('color', 'red');
    this.append("8888");
    return this.each(function() {
        //对每个元素进行操作
        $(this).append("dadada");
    })
}
}(jQuery)
/*
 *
 *面向对象性质的  插件 
 * 
 * */
+(function($){
	//定义Beautifier的构造函数
	var Beautifier = function(ele, opt) {
	    this.$element = ele,
	    this.defaults = {
	        'color': 'red',
	        'fontSize': '12px',
	        'textDecoration':'none'
	    },
	    this.options = $.extend({}, this.defaults, opt)
	}
    //定义Beautifier的方法
	Beautifier.prototype = {
		//定义Beautifier的方法
	    beautify: function() {
	        return this.$element.css({
	            'color': this.options.color,
	            'fontSize': this.options.fontSize,
	            'textDecoration': this.options.textDecoration
	        })
	    },
	    //定义 big方法（实验 增加方法）
	    big: function() {
	    	return this.$element.append("22");
	    }
	}
    //在插件中使用Beautifier对象
	$.fn.myPlugin = function(options) {
	    //创建Beautifier的实体
	    var beautifier = new Beautifier(this, options);
	    //调用其方法
	    return beautifier.beautify();
	}
	//实验 使用新增的 big方法
	$.fn.big = function(options){
		var ss = new Beautifier(this, options);
		return ss.big(); //这种返回的方式 类似 jQuery的函数用法
	}
})(jQuery)

