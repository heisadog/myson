/*尝试写个插件
 * 2016-12-26
 * 主要功能：
 *   1.设置预览的大小
 *   2.压缩图片的大小
 * */
(function($){
	//先做一个压缩的插件
	$.fn.imgloadsize = function(options){
		var defaults = {
			canvasWidth:300,
			canvasHeight:300,
			quality :0.92 //图片的质量 一般默认这个数值左右
		};
		var opts = $.extend({},defaults,options);
		return $(this).each(function(){
			//事件是给 input =file绑定的 
			$(this).change(function(){
				//console.log("选了图片")选了图片后执行的过程 在此过程中将图片压缩（）
                var files = $(this)[0].files;
                var f = files[0];
                console.log(f);
                var reader = new FileReader();
                reader.readAsDataURL(f);
                reader.onload =function(e){
                	url = e.target.result;
                	var imgss = new Image();
                	imgss.src = url;
                	var Cnv = document.getElementById('myCanvas');
                    var Cntx = Cnv.getContext('2d');//获取2d编辑容器
                    //等比缩放
                    //var m = imgss.width / imgss.height;
                    Cnv.height = opts.canvasHeight;//该值影响缩放后图片的大小
                    Cnv.width  = opts.canvasWidth ;
                    //img放入画布中
                    //设置起始坐标，结束坐标
                    Cntx.drawImage(imgss, 0, 0,opts.canvasWidth,opts.canvasHeight);
                    var Pic = Cnv.toDataURL("image/png",opts.quality);
                    //console.log(Pic) 这里得到的Pic 就可以进行上传操作等
                    var img = '<img src="' + Pic + '"/>';
                    $("#showimgbox").html(img);
                }
                
			})
		})
	}
})(jQuery)
