/*
* 关于 移动端点击事件处理
* 参考过的框架 大部分都是用 FastClick 处理的，然后直接使用click事件！！！
* 这里单独分离出来一个tap.js，是因为 还可以自己封装tap事件。结合项目 与知识学习，特地分离出来一个单独的js，算是做个总结和学习！
*    其中，单独封装tap 可以选择比较成熟的第三方js，比如hammer.js，里面包含了丰富的移动端事件！！！
* */
var eventFlag = false;
var ev = {
    sta : eventFlag ? "mousedown" : "touchstart",
    end : eventFlag ? "mouseup" : "touchend",
    mov : "touchmove",
    tar : null,
}
var util ={
	tap : function(s, fun)
	{
		$(s).on(ev.sta, function(){
			ev.tar = this;
		}).on(ev.end, function(){
			if(ev.tar == this)
			{
				ev.tar = null;
				fun(this);
			}
		}).on(ev.mov, function(){
			ev.tar = null;
		});
	},
	liveTap: function (s, fun, e) {
		//动态节点触发Tap事件
		/*
		* 同事在原先的基础上搞了个 动态节点触发事件。
		* 上述的tap事件，动态添加的节点，有初入。如果将tap事件放在外层，会不起作用，我习惯于将事件跟在动态节点后面。
		* 其实这些问题用hammer 给body绑定都能解决 
		* */
		if (typeof e === "string" && e) {
			$(s).on(ev.sta, e, function () {
				ev.tar = this;
			}).on(ev.end, e, function () {
				if (ev.tar == this) {
					ev.tar = null;
					fun(this);
				}
			}).on(ev.mov, e, function () {
				ev.tar = null;
			});
		} else {
			$(s).on(ev.sta, function () {
				ev.tar = this;
			}).on(ev.end, function () {
				if (ev.tar == this) {
					ev.tar = null;
					fun(this);
				}
			}).on(ev.mov, function () {
				ev.tar = null;
			});
		}
	},
}
+(function ($) {
	$.fn.tap = function (call) {
		return this.each(function () {
			$(this).on("touchstart",function (e) {
				var touches = e.touches;
				startTx = e.originalEvent.targetTouches[0].pageX;
				startTy = e.originalEvent.targetTouches[0].pageY;
			})
			$(this).on("touchend",function (e) {
				var touches = e.changedTouches,
					endTx = e.originalEvent.changedTouches[0].pageX,
					endTy = e.originalEvent.changedTouches[0].pageY;
				if( Math.abs(startTx - endTx) < 6 && Math.abs(startTy - endTy) < 6 ){//Math.abs 返回 绝对值
					call(this);
				}
			})
		})
	}
	//我习惯于jQuery的方式，改写了个tap模式
	//用法 $("#themesure").tap(function (_this) {
})(jQuery)
//上述两个tap的用法都是一样的。this作为回调参数。所以在使用的 时候 _this 就已经指向本身！
// util.tap("#themesure",function (_this) {
// 	console.log(0)
// 	localStorage.color = col;
// })
// $("#themesure").tap(function (_this) {
// 	console.log($(_this).attr("data-id"))
// 	console.log("23")
// })
//hammer 方式
// $('body').hammer().on('tap', '#tab>a', function (event) {
// 	event.stopPropagation();
// 	currentTab = $(this).attr('id') || 'tab_posx';
// 	changeTab();
// });

