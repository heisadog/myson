/*
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
 * js版
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
		return time.formatDate(weekStartDate); 
	},
	//获取本周 结束 的日期
	getWeekEndDate:function(){
		var weekEndDate = new Date(time.nowYear, time.nowMonth, time.nowDay + (6 - time.nowDayOfWeek));
		return time.formatDate(weekEndDate); 
	},
	//获取本月的 开始 日期 
	getMonthStartDate:function(){
		var monthStartDate = new Date(time.nowYear,time.nowMonth,1);
		return time.formatDate(monthStartDate); 
	},
	//本月 结束  时间
	getMonthEndDate:function(){
		var monthEndDate = new Date(time.nowYear, time.nowMonth, time.getMonthDays(time.nowMonth)); 
        return time.formatDate(monthEndDate); 
	},
	//上个月的 开始 日期
	getPreMonthStartDate:function(){
		var preMonthStartDate = new Date(time.preYear,time.preMonth,1);
		return time.formatDate(preMonthStartDate); 
	},
	//上个月的 结束 日期
	getPreMonthEndDate:function(){
		var preMonthEndDate = new Date(time.preYear,time.preMonth,time.getMonthDays(time.preMonth));
		return time.formatDate(preMonthEndDate); 
	},
	
	//本季度的 开始日期
	getQuarterStartDate:function(){
		var quarterStartDate = new Date(time.nowYear, time.getQuarterStartMonth(), 1); 
        return time.formatDate(quarterStartDate); 
	},
	//本季度的 结束 日期
	getQuarterEndDate:function(){
		var quarterEndMonth = time.getQuarterStartMonth() + 2; 
		var quarterStartDate = new Date(time.nowYear, quarterEndMonth, time.getMonthDays(quarterEndMonth)); 
		return time.formatDate(quarterStartDate);
	},
	//年的开始 就简单了 由年份 直接拼写吧
	getYearStartDate:function(){
		return time.nowYear+"-01"+"-01";
	},
	getYearEndDate:function(){
		return time.nowYear+"-12"+"-31";
	}
	
};





















